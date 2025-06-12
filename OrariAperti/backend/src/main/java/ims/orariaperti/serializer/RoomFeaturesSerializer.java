package ims.orariaperti.serializer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import ims.orariaperti.utilities.RoomFeatures;

import java.io.IOException;

public class RoomFeaturesSerializer extends JsonSerializer<RoomFeatures> {
    @Override
    public void serialize(RoomFeatures value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        gen.writeString(value.getFeature());
    }
}