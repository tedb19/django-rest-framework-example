import json

from django.shortcuts import render
from django.http import HttpResponse, QueryDict
from talk.models import Post
from talk.forms import PostForm


def home(req):

    tmpl_vars = {
        'all_posts': Post.objects.reverse(),
        'form': PostForm()
    }
    return render(req, 'talk/index.html', tmpl_vars)


def create_post(request):
    if request.method == 'POST':
        post_text = request.POST.get('the_post')
        response_data = {}

        post = Post(text=post_text, author=request.user)
        post.save()

        response_data['result'] = 'Create POST successful'
        response_data['postpk'] = post.pk
        response_data['text'] = post.text
        response_data['created'] = post.created.strftime('%B %d, %Y %I:%M %p')
        response_data['author'] = post.author.username

        '''
        In django 1.7, you can use the following to create a json http response
        from django.http import JsonResponse
        return JsonResponse(response_data)
        '''
        return HttpResponse(
            json.dumps(response_data),
            content_type='application/json'
        )
    else:
        return HttpResponse(
            json.dumps({'nothing to see': 'this isnt happening'}),
            content_type='application/json'
        )


def delete_post(request):
    if request.method == 'DELETE':
        '''
        In an HttpRequest object, the GET and POST attributes are
        instances of django.http.QueryDict, a dictionary-like class
        customized to deal with multiple values for the same key.
        This is necessary because some HTML form elements,
        notably <select multiple>, pass multiple values for the same key.
        https://docs.djangoproject.com/en/1.8/ref/request-response/#querydict-objects

        Why can’t we do request.DELETE.get?
        Well, because Django does not construct a dictionary for DELETE
        (or PUT)
        requests like it does for GET and POST requests.
        Thus, we constructed our own dictionary using the get method from the
        QueryDict class.
        '''
        post = Post.objects.get(
            pk=int(QueryDict(request.body).get('postpk')))

        post.delete()

        response_data = {}
        response_data['msg'] = 'Post successfully deleted'

        return HttpResponse(
            json.dumps(response_data),
            content_type='application/json'
        )
    else:
        return HttpResponse(
            json.dumps({"nothing to see": "this isn't happening"}),
            content_type="application/json"
        )
