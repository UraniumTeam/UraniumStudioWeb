# Provider
terraform {
  required_providers {
    yandex = {
      source = "yandex-cloud/yandex"
    }
  }
  required_version = ">= 0.13"
}

provider "yandex" {
  token     = var.oauth_token
  cloud_id  = var.cloud_id
  folder_id = var.folder_id
  zone      = var.zone
}

# Network
resource "yandex_vpc_network" "network" {
  name = "uranium-network"
}

resource "yandex_vpc_subnet" "studio-subnet" {
  name           = "studio-subnet"
  zone           = var.zone
  network_id     = yandex_vpc_network.network.id
  v4_cidr_blocks = ["192.168.24.0/24"]
}

# PostgreSQL
resource "yandex_mdb_postgresql_cluster" "pgsql" {
  name        = "un-studio-pgsql"
  environment = "PRESTABLE"
  network_id  = yandex_vpc_network.network.id

  config {
    version = "15"
    resources {
      resource_preset_id = "b2.medium"
      disk_type_id       = "network-hdd"
      disk_size          = "10"
    }
    access {
      web_sql = true
    }
  }

  host {
    zone      = var.zone
    subnet_id = yandex_vpc_subnet.studio-subnet.id
  }
}

resource "yandex_mdb_postgresql_user" "pg_user" {
  cluster_id = yandex_mdb_postgresql_cluster.pgsql.id
  name       = var.pg_username
  password   = var.pg_password
  login      = true
  settings = {
    default_transaction_isolation = "read committed"
    log_min_duration_statement    = 5000
  }
}

resource "yandex_mdb_postgresql_database" "db" {
  cluster_id = yandex_mdb_postgresql_cluster.pgsql.id
  name       = var.pg_db
  owner      = yandex_mdb_postgresql_user.pg_user.name
  depends_on = [
    yandex_mdb_postgresql_user.pg_user
  ]
}

output "pg_fqdn" {
  value = yandex_mdb_postgresql_cluster.pgsql.host.0.fqdn
}

# Service account
resource "yandex_iam_service_account" "sa" {
  name        = "sa-un-studio"
  description = "SA for UraniumStudioWeb"
  folder_id   = var.folder_id
}

resource "yandex_resourcemanager_folder_iam_member" "sa-storage-editor" {
  folder_id = var.folder_id
  role      = "storage.editor"
  member    = "serviceAccount:${yandex_iam_service_account.sa.id}"
}

resource "yandex_resourcemanager_folder_iam_member" "sa-images-puller" {
  folder_id = var.folder_id
  role      = "container-registry.images.puller"
  member    = "serviceAccount:${yandex_iam_service_account.sa.id}"
}

resource "yandex_resourcemanager_folder_iam_member" "sa-images-pusher" {
  folder_id = var.folder_id
  role      = "container-registry.images.pusher"
  member    = "serviceAccount:${yandex_iam_service_account.sa.id}"
}

resource "yandex_iam_service_account_static_access_key" "sa-static-key" {
  service_account_id = yandex_iam_service_account.sa.id
  description        = "static access key for object storage"
}

# Object storage
resource "yandex_storage_bucket" "bucket" {
  access_key = yandex_iam_service_account_static_access_key.sa-static-key.access_key
  secret_key = yandex_iam_service_account_static_access_key.sa-static-key.secret_key
  bucket     = var.bucket_name
}

output "bucket_domain_name" {
  value = yandex_storage_bucket.bucket.bucket_domain_name
}

# Backend
data "yandex_compute_image" "container-optimized-image" {
  family = "container-optimized-image"
}

resource "yandex_compute_instance" "backend" {
  name               = "un-studio-backend"
  platform_id        = "standard-v3"
  zone               = var.zone
  service_account_id = yandex_iam_service_account.sa.id

  resources {
    cores         = 2
    memory        = 2
    core_fraction = 20
  }

  scheduling_policy {
    preemptible = true
  }

  boot_disk {
    initialize_params {
      image_id = data.yandex_compute_image.container-optimized-image.id
    }
  }

  network_interface {
    subnet_id = yandex_vpc_subnet.studio-subnet.id
    nat       = false
  }

  metadata = {
    docker-compose = templatefile("${path.module}/docker-compose.yml", {
      pg_host        = yandex_mdb_postgresql_cluster.pgsql.host.0.fqdn
      port           = "5432"
      pg_db          = var.pg_db
      pg_username    = var.pg_username
      pg_password    = var.pg_password
      container_name = "un-studio-backend"
    })

    ssh-keys = "${var.vm_username}:${var.public_ssh}"
  }

  depends_on = [
    yandex_storage_bucket.bucket,
    yandex_mdb_postgresql_cluster.pgsql
  ]
}

# Frontend
resource "yandex_serverless_container" "frontend" {
  service_account_id = yandex_iam_service_account.sa.id
  name               = "un-studio-frontend"
  memory             = 256
  cores              = 1
  core_fraction      = 20
  concurrency        = 1

  image {
    url = "cr.yandex/${var.container_registry_id}/un-studio-frontend"
  }

  depends_on = [
    yandex_compute_instance.backend
  ]
}

output "frontend_url" {
  value = yandex_serverless_container.frontend.url
}


output "backend_internal_ip_address" {
  value = yandex_compute_instance.backend.network_interface.0.ip_address
}

output "backend_external_ip_address" {
  value = yandex_compute_instance.backend.network_interface.0.nat_ip_address
}

output "_info" {
  value = {
    "Frontend" : "${yandex_serverless_container.frontend.url}"
    "Backend internal ip" : "${yandex_compute_instance.backend.network_interface.0.ip_address}"
  }
}
