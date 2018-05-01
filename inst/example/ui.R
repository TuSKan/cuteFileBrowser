library(shiny)
library(cuteFileBrowser)

shinyUI(
  fluidPage(
    theme = "bootstrap.css",
    titlePanel("Cute File Browser"),
      cuteFileBrowserUI(
        inputId = "file"
      )
    )
)