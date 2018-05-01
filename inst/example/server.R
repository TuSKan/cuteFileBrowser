library(shiny)
library(cuteFileBrowser)

shinyServer(function(input, output, session) {

  cuteFileBrowserServer(
    inputId = "file",
    rootDirectory = "~"
  )

  observeEvent(input$file, {
    showNotification(input$file)
  });

})