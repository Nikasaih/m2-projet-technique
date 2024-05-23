import 'package:camera/camera.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';
import 'HomePage.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  // Obtain a list of the available cameras on the device.
  final cameras = await availableCameras();

  // Get a specific camera from the list of available cameras.
  final firstCamera = cameras.first;

  runApp(MyApp(camera: firstCamera));
}

class MyApp extends StatelessWidget {
  final CameraDescription camera;

  const MyApp({super.key, required this.camera});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Collection de Pièces',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: HomePage(title: 'Collection de Pièces', camera: camera),
      //home: TakePictureScreen(camera: camera),
    );
  }
}

class Coin {
  final int year;
  final String rarity;
  final int quantity;
  final int value;
  final String url;
  final Timestamp dateAdd = Timestamp.now();

  Coin({
    required this.year,
    required this.rarity,
    required this.quantity,
    required this.value,
    required this.url,
  });

  Map<String, dynamic> toFirestore() {
    return {
      'year': year,
      'rarity': rarity,
      'quantity': quantity,
      'value': value,
      'url': url,
    };
  }

  factory Coin.fromFirestore(DocumentSnapshot doc) {
    Map<String, dynamic> data = doc.data() as Map<String, dynamic>;
    return Coin(
      year: data['year'],
      rarity: data['rarity'],
      quantity: data['quantity'],
      value: data['value'],
      url: data['url'],
    );
  }
}
