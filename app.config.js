export default {
  expo: {
    name: "Scantocall",
    slug: "scantocall",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.jpg",
    userInterfaceStyle: "light",

    extra: {
      eas: {
        projectId: "93cfa12f-ef54-425d-8785-a4110159687b"
      }
    },

    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },

    assetBundlePatterns: ["**/*"],

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.pranav01.scantocall",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSCameraUsageDescription: "This app needs access to camera to take profile photos.",
        NSPhotoLibraryUsageDescription: "This app needs access to photo library to select profile images."
      }
    },

    android: {
      package: "com.pranav01.scantocall",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      },
      permissions: [
        "INTERNET",
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "READ_MEDIA_IMAGES"
      ]
    },

    web: {
      favicon: "./assets/favicon.png"
    },

    scheme: "scantocall",

    plugins: [
      [
        "expo-build-properties",
        {
          android: {
            enableProguardInReleaseBuilds: true
          }
        }
      ],
      [
        "expo-image-picker",
        {
          photosPermission: "The app accesses your photos to let you share them.",
          cameraPermission: "The app accesses your camera to let you take photos."
        }
      ]
    ]
  }
};