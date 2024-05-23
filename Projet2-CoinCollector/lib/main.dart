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
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Collection de Pièces',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const HomePage(title: 'Collection de Pièces'),
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

