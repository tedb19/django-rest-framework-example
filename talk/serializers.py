from django.contrib.auth.models import User

from rest_framework import serializers

from talk.models import Post

'''
DRF’s Serializers convert model instances to Python dictionaires,
which can then be rendered in various API appropriate
formats – like JSON or XML. Similar to the Django ModelForm class,
DRF comes with a concise format for its Serializers, the ModelSerializer
class. It’s simple to use: Just tell it which fields you want to use
from the model
-
-
-
For each model that you wish to expose its resources, create a serializer
as shown:
'''


class PostSerializer(serializers.ModelSerializer):

    '''
    The SlugRelatedField allows us to change the target
    of the author field from id to username
    '''
    author = serializers.SlugRelatedField(
        queryset=User.objects.all(),
        slug_field='username'
    )

    class Meta:
        model = Post
        fields = ('id', 'author', 'text', 'created', 'updated')
