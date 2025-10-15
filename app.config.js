export default {
  expo: {
    name: "whatsinmyfood",
    slug: "whats-in-my-food",
    version: "1.0.0",
    orientation: "portrait",
    icon: "assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSCameraUsageDescription: "$(PRODUCT_NAME) needs access to your Camera in order to scan barcodes.",
        ITSAppUsesNonExemptEncryption: false,
      },
      bundleIdentifier: "com.dylanbozarthwork.whatsinmyfood",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      permissions: ["android.permission.CAMERA"],
      package: "com.dylanbozarthwork.whatsinmyfood",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      [
        "expo-camera",
        {
          cameraPermission: "Allow $(PRODUCT_NAME) to access your camera to scan barcodes",
        },
      ],
      [
        "expo-build-properties",
        {
          android: {
            kotlinVersion: "2.0.21",
            gradleProperties: {
              kotlinVersion: "2.0.21",
              composeCompilerVersion: "1.6.10",
            },
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: "37b5ee22-07d2-4c00-a69d-c46f56e723e0",
      },
    },
    owner: "dylanbozarthdev",
  },
}
