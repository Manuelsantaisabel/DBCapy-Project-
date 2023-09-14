from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer
from rest_framework import serializers


User = get_user_model()

class UserCreateSerializer(UserCreateSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'estatus','description')

    
    def validate(self, attrs):
        if attrs['password'] != attrs.pop('re_password'):
            raise serializers.ValidationError("Las contraseñas no coinciden")
        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            estatus=validated_data['estatus'],
            description=validated_data.get('description', ''),
        )
        user.set_password(validated_data['password'])
        user.save()
        return user