data "archive_file" "auth_zip" {
  type        = "zip"
  source_file = "../auth.js"
  output_path = "auth_function.zip"
}

data "archive_file" "sync_zip" {
  type        = "zip"
  source_file = "../sync.js"
  output_path = "sync_function.zip"
}