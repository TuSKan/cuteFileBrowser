
.onLoad <- function(...) {
  shiny::addResourcePath('cuteFileBrowser', system.file('cuteFileBrowser', package = 'cuteFileBrowser'))
}

file.structure <- function(dir) {

  files <- list()

  if (!file.exists(dir)) return(files)

  for (f in list.files(dir)) {
    if (grepl("^[.]",f)) return(NULL)
    if (dir.exists(file.path(dir,f))) {
      files[[f]] <- list(name = f, type = "folder", path = file.path(dir,f), items = file.structure(file.path(dir,f)))
    } else {
      files[[f]] <- list(name = f, type = "file", path = file.path(dir,f), size = file.size(file.path(dir,f)))
    }
  }

  files
}
