library(shiny)
library(cuteFileBrowser)

shinyServer(function(input, output, session) {

  cuteFileBrowserServer(
    inputId = "file",
    rootDirectory = "~" #Sys.getenv("HOME")
  )

  observeEvent(input$file, {
    showNotification(input$file$path)
  });

})