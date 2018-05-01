(function ($) {

  $.fn.cuteFileBrowser = function (data) {

	var filemanager = $('.cuteFileBrowser'),
		breadcrumbs = $('.breadcrumbs'),
		fileList = filemanager.find('.data');

	// Start by fetching the file data
		var response = [data],
			currentPath = '',
			breadcrumbsUrls = [];

		var folders = [],
			files = [];

    // Init
	  currentPath = data.path;
		breadcrumbsUrls.push(data.path);
		render(searchByPath(data.path));
		filemanager.prop("filepath","");

		// Hiding and showing the search box
		filemanager.find('.search').click(function(){

			var search = $(this);

			search.find('span').hide();
			search.find('input[type=search]').show().focus();

		});

		// Listening for keyboard input on the search field.
		filemanager.find('input').on('input', function(e){

			folders = [];
			files = [];

			var value = this.value.trim();

			if(value.length) {
				filemanager.addClass('searching');
				goto(value);
			}

			else {
				filemanager.removeClass('searching');
			}

		}).on('keyup', function(e){

			// Clicking 'ESC' button triggers focusout and cancels the search

			var search = $(this);

			if(e.keyCode == 27) {

				search.trigger('focusout');

			}

		}).focusout(function(e){

			// Cancel the search

			var search = $(this);

			if(!search.val().trim().length) {
				search.hide();
				search.parent().find('span').show();
			}

		});

		// Clicking on files
		fileList.on('click', 'li.files', function(e){
			e.preventDefault();
			$('.cuteFileBrowser .data li.files').removeClass("selected");
			$(this).addClass("selected");
			filemanager.prop("filepath", $(this).find('a.files').attr('href')).change();
		});


		// Clicking on folders
		fileList.on('click', 'li.folders', function(e){
			e.preventDefault();

			var nextDir = $(this).find('a.folders').attr('href');

			if(filemanager.hasClass('searching')) {

				// Building the breadcrumbs

				breadcrumbsUrls = generateBreadcrumbs(nextDir);

				filemanager.removeClass('searching');
				filemanager.find('input[type=search]').val('').hide();
				filemanager.find('span').show();
			}
			else {
				breadcrumbsUrls.push(nextDir);
			}

			currentPath = nextDir;
			goto(nextDir);
		});


		// Clicking on breadcrumbs
		breadcrumbs.on('click', 'a', function(e){
			e.preventDefault();

			var index = breadcrumbs.find('a').index($(this)),
				nextDir = breadcrumbsUrls[index];

			breadcrumbsUrls.length = Number(index);

			goto(nextDir);

		});

		// Navigates to the given path
		function goto(path) {

			if (path.length) {
				var rendered = '';

				// if hash has search in it

				if (filemanager.hasClass('searching')) {
					render(searchData(response, path));
				}
				// if hash is some path
				else {
					rendered = searchByPath(path);
					currentPath = path;
					breadcrumbsUrls = generateBreadcrumbs(path);
					render(rendered);
				}
			}
		}

		// Splits a file path and turns it into clickable breadcrumbs
		function generateBreadcrumbs(nextDir){
			var path = nextDir.split('/').slice(0);
			for(var i=1;i<path.length;i++){
				path[i] = path[i-1]+ '/' +path[i];
			}
			return path;
		}


		// Locates a file by path
		function searchByPath(dir) {
			var path = dir.split('/'),
				demo = response,
				flag = 0;

			for(var i=0;i<path.length;i++){
				for(var j in demo){
					if(demo[j].name === path[i]){
						flag = 1;
						demo = demo[j].items;
						break;
					}
				}
			}

			demo = flag ? demo : [];
			return demo;
		}


		// Recursively search through the file tree
		function searchData(data, searchTerms) {

			Object.keys(data).forEach( function(d) {
				if(data[d].type === 'folder') {

					searchData(data[d].items,searchTerms);

					if(data[d].name.toLowerCase().match(searchTerms)) {
						folders.push(data[d]);
					}
				}
				else if(data[d].type === 'file') {
					if(data[d].name.toLowerCase().match(searchTerms)) {
						files.push(data[d]);
					}
				}
			});
			return {folders: folders, files: files};
		}


		// Render the HTML for the file manager
		function render(data) {

			var scannedFolders = [],
				scannedFiles = [];

			if (typeof data.folders !== 'undefined' || typeof data.files !== 'undefined')
			{
			  scannedFolders = data.folders;
			  scannedFiles = data.files;
			} else {
        Object.keys(data).forEach( function(d) {
  				if (data[d].type === 'folder') {
  					scannedFolders.push(data[d]);
  				}
  				else if (data[d].type === 'file') {
  					scannedFiles.push(data[d]);
				  }
			  });
			}

			// Empty the old result and make the new one

			fileList.empty().hide();

			if(!scannedFolders.length && !scannedFiles.length) {
				filemanager.find('.nothingfound').show();
			}
			else {
				filemanager.find('.nothingfound').hide();
			}

			if(scannedFolders.length) {

				scannedFolders.forEach(function(f) {

					var itemsLength =  Object.keys(f.items).length,
						name = escapeHTML(f.name),
						icon = '<span class="icon folder"></span>';

					if(itemsLength) {
						icon = '<span class="icon folder full"></span>';
					}

					if(itemsLength == 1) {
						itemsLength += ' item';
					}
					else if(itemsLength > 1) {
						itemsLength += ' items';
					}
					else {
						itemsLength = 'Empty';
					}

					var folder = $('<li class="folders"><a href="'+ f.path +'" title="'+ f.path +'" class="folders">'+icon+'<span class="name">' + name + '</span> <span class="details">' + itemsLength + '</span></a></li>');
					folder.appendTo(fileList);
				});

			}

			if(scannedFiles.length) {

				scannedFiles.forEach(function(f) {

					var fileSize = bytesToSize(f.size),
						name = escapeHTML(f.name),
						fileType = name.split('.'),
						icon = '<span class="icon file"></span>';

					fileType = fileType[fileType.length-1];

					icon = '<span class="icon file f-'+fileType+'">.'+fileType+'</span>';

					var file = $('<li class="files"><a href="'+ f.path+'" title="'+ f.path +'" class="files">'+icon+'<span class="name">'+ name +'</span> <span class="details">'+fileSize+'</span></a></li>');
					file.appendTo(fileList);
				});

			}


			// Generate the breadcrumbs

			var url = '';

			if(filemanager.hasClass('searching')){

				url = '<span>Search results: </span>';
				fileList.removeClass('animated');

			}
			else {

				fileList.addClass('animated');

				breadcrumbsUrls.forEach(function (u, i) {

					var name = u.split('/');

					if (i !== breadcrumbsUrls.length - 1) {
						url += '<a href="'+u+'"><span class="folderName">' + name[name.length-1] + '</span></a> <span class="arrow">→</span> ';
					}
					else {
						url += '<span class="folderName">' + name[name.length-1] + '</span>';
					}

				});

			}

			breadcrumbs.text('').append(url);


			// Show the generated elements

			fileList.animate({'display':'inline-block'});
			fileList.css({'display':'inline-block'});

		}


		// This function escapes special html characters in names
		function escapeHTML(text) {
			return text.replace(/\&/g,'&amp;').replace(/\</g,'&lt;').replace(/\>/g,'&gt;');
		}


		// Convert file sizes from bytes to human readable units
		function bytesToSize(bytes) {
			var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
			if (bytes === 0) return '0 Bytes';
			var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
			return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
		}

	};
}( jQuery ));

//

$(document).ready(function () {

     var cuteFileBrowserInput = new Shiny.InputBinding();
     $.extend(cuteFileBrowserInput, {
         find: function (scope) {
             return $(scope).find(".cuteFileBrowser");
         },
         getValue: function (el) {
           return $(el).prop("filepath");
         },
         subscribe: function (el, callback) {
             $(el).on("change.cuteFileBrowser", function (e) {
                 callback();
             });
         },
         unsubscribe: function (el) {
             $(el).off(".cuteFileBrowser");
         },
         receiveMessage: function(el, data) {
           var $el = $(el);
            if (data.root !== undefined) {
              $el.cuteFileBrowser(data.root);
            }
         }

      });

   Shiny.inputBindings.register(cuteFileBrowserInput);
 });


