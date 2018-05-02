library(shiny)
library(cuteFileBrowser)

shinyUI(
  fluidPage(
    titlePanel("Cute File Browser"),
      cuteFileBrowserUI(
        inputId = "file"
      )
    )
)