data "archive_file" "auth_zip" {
  type        = "zip"
  source_file = "../auth.js"
  output_path = "auth_function.zip"
}