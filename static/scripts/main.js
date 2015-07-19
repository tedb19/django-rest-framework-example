$(document).ready(function() {
    // Submit post on submit
    $('#post-form').on('submit', function(event){
        event.preventDefault();
        console.log("form submitted!")  // sanity check
        create_post();
    });
    /*
    * Here we use the jquery 'starts with' selector (i.e. ^) to
    * select all anchor tags with an id that starts with 'delete-post-'
    */
    $('#talk').on('click', 'a[id^=delete-post-]', function (){
        var post_primary_key = $(this).attr('id').split('-')[2];
        console.log(post_primary_key) //sanity check
        delete_post(post_primary_key);
    })
});



// AJAX for posting
function create_post() {
    var $post_text = $('#post-text');
    $.ajax({
        url: 'create_post/', //the endpoint
        type: 'POST',
        data: {the_post: $post_text.val()},
        success: function(json){
            $("#talk").prepend("<li id='post-"+ json.postpk +"'><strong>"+json.text+"</strong> - <em> "+json.author+"</em> - <span> "+json.created+"</span>- <a id='delete-post-"+json.postpk+"'>delete me</a></li>");
            $post_text.val('');//clear the text field

        },
        error: function(xhr,errmsg,err){
            var result_html = '<div class="alert-box alert radius" data-alert> Ooops! We have encountered an error: ';
            result_html += errmsg + " <a href='#' class='close'>&times;</a></div>";
            $('#results').html(result_html);
        }
    });
};

/*
* AJAX for deletion
* For browsers that dont support 'DELETE' http method, 
* consider POST Tunelling (https://gist.github.com/mjhea0/43d7b4285c59c2083123)
*/
function delete_post(post_primary_key){
    if(confirm('are you sure you want to delete?') == true){
        $.ajax({
            url: 'delete_post/', //endpoint
            type: "DELETE", //http method
            data: {postpk: post_primary_key},
            success: function(json) {
                //hide the post
                $('#post-'+post_primary_key).hide();
                console.log("post deletion successful");
            },
            error: function(xhr, errmsg, err){
                // Show an error
                $('#results').html("<div class='alert-box alert radius' data-alert>"+
                "Oops! We have encountered an error. <a href='#' class='close'>&times;</a></div>"); // add error to the dom
                console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
            }
        })
    } else{
        return false;
    }
}

// This function gets cookie with a given name
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');
 
/*
The functions below will create a header with csrftoken
*/
 
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
function sameOrigin(url) {
    // test that a given url is a same-origin URL
    // url could be relative or scheme relative or absolute
    var host = document.location.host; // host + port
    var protocol = document.location.protocol;
    var sr_origin = '//' + host;
    var origin = protocol + sr_origin;
    // Allow absolute or scheme relative URLs to same origin
    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
        (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
        // or any other URL that isn't scheme relative or absolute i.e relative.
        !(/^(\/\/|http:|https:).*/.test(url));
}

//ajaxSetup sets default values for all future Ajax requests, 
//unless overridden by the individual ajax calls.
$.ajaxSetup({
    //beforeSend is a function to run before the request is sent
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
            // Send the token to same-origin, relative URLs only.
            // Send the token only if the method warrants CSRF protection
            // Using the CSRFToken value acquired earlier
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});