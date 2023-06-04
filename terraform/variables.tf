variable "oauth_token" {
  type      = string
  sensitive = true
}

variable "cloud_id" {
  type = string
}

variable "folder_id" {
  type = string
}

variable "zone" {
  type    = string
  default = "ru-central1-b"
}

variable "pg_username" {
  type = string
}

variable "pg_password" {
  type      = string
  sensitive = true
}

variable "pg_db" {
  type    = string
  default = "studio-db"
}

variable "bucket_name" {
  type = string
}

variable "container_registry_id" {
  type = string
}

variable "vm_username" {
  type    = string
  default = "studio"
}

variable "public_ssh" {
  type = string
}
