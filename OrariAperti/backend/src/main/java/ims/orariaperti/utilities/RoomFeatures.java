package ims.orariaperti.utilities;

public enum RoomFeatures {
    BEAMER("Beamer"),
    WATER_SOURCE("Water Tap"),
    WHITEBOARD("Whiteboard"),
    AIR_CONDITIONING("Air Conditioning"),
    PROJECTOR_SCREEN("Projector Screen"),
    SPEAKER_SYSTEM("Speaker System"),
    VIDEO_CONFERENCING("Video Conferencing"),
    WIFI("WiFi"),
    POWER_OUTLETS("Power Outlets"),
    NATURAL_LIGHT("Natural Light"),
    SOUNDPROOFING("Soundproofing"),
    SMART_BOARD("Smart Board"),
    TELEPHONE("Telephone"),
    COFFEE_MACHINE("Coffee Machine"),
    PRINTER("Printer"),
    LOCKERS("Lockers");

    private final String feature;

    RoomFeatures(String name) {
        this.feature = name;
    }

    public String getFeature() {
        return feature;
    }
}