from rest_framework import serializers
from .models import PipelineStage

class PipelineStageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PipelineStage
        fields = '__all__'
