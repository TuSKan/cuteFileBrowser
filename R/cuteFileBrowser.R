#' Cute File Browser
#'
#' Create a materialize file input
#' @param inputId String. The input identifier used to access the value.
#'
#' @examples
#' if (interactive()) {
#' library(shiny)
#' library(cuteFileBrowser)
#' ui <-
#'  fluidPage(
#'     theme = "bootstrap.css",
#'     titlePanel("Cute File Browser"),
#'     cuteFileBrowserUI(
#'       inputId = "file"
#'     )
#'  )
#'
#' server <- function(input, output, session) {
#'   cuteFileBrowserServer(
#'     inputId = "file",
#'     rootDirectory = "~"
#'   )
#'
#'   observeEvent(input$file, {
#'     showNotification(input$file)
#'   });
#' }
#'
#' shinyApp(ui = ui, server = server)
#' }
#'
#' @export
cuteFileBrowserUI <- function(inputId) {

  shiny::div(
    id = inputId,
    class = "cuteFileBrowser",
    shiny::div(
      class = "search",
      shiny::tags$input(
        type = "search",
        placeholder = "Find a file.."
      )
    ),
    shiny::div(
      class = "breadcrumbs"
    ),
    shiny::tags$ul(
      class = "data"
    ),
    shiny::div(
      class = "nothingfound",
      shiny::div(
        class = "nofiles",
        shiny::tags$span(
          "No files here."
        )
      )
    ),
    shiny::singleton(
      shiny::tags$head(
        shiny::tags$link(
          href = "www/css/cuteFileBrowser.css",
          rel = 'stylesheet',
          type = 'text/css'
        ),
        shiny::tags$script(
          src = "www/js/cuteFileBrowser.js"
        )
      )
    )
  )

}


#' @rdname cuteFileBrowserUI
#' @param rootDirectory String. The begin directory to browser. Read-only access needed.
#' @param session Shiny default reactive domain.
#'
#' @export
cuteFileBrowserServer <- function(inputId, rootDirectory, session = shiny::getDefaultReactiveDomain()) {
  root <- list(name = rootDirectory, type = "folder", path = rootDirectory, items = file.structure(rootDirectory))
  session$sendInputMessage(
    inputId,
    list(root = root)
  )
}


