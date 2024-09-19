import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';

class RequestPermissions extends StatefulWidget {
  @override
  _RequestPermissionsState createState() => _RequestPermissionsState();
}

class _RequestPermissionsState extends State<RequestPermissions> {
  Future<void> _requestPermissions() async {
    // Request multiple permissions at once
    Map<Permission, PermissionStatus> statuses = await [
      Permission.camera,
      Permission.storage, // For both read and write
      Permission.accessMediaLocation, // For access to external storage media
    ].request();

    // Handle the permission statuses
    if (statuses[Permission.camera]?.isGranted ?? false) {
      print('Camera permission granted');
    } else if (statuses[Permission.camera]?.isDenied ?? false) {
      print('Camera permission denied');
    } else if (statuses[Permission.camera]?.isPermanentlyDenied ?? false) {
      print('Camera permission permanently denied, please enable it from settings');
      openAppSettings();
    }

    if (statuses[Permission.storage]?.isGranted ?? false) {
      print('Storage permission granted');
    } else if (statuses[Permission.storage]?.isDenied ?? false) {
      print('Storage permission denied');
    } else if (statuses[Permission.storage]?.isPermanentlyDenied ?? false) {
      print('Storage permission permanently denied, please enable it from settings');
      openAppSettings();
    }

    // Add other permission checks if needed (e.g., network state)
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Request Permissions"),
      ),
      body: Center(
        child: ElevatedButton(
          onPressed: _requestPermissions,
          child: Text("Request All Permissions"),
        ),
      ),
    );
  }
}
