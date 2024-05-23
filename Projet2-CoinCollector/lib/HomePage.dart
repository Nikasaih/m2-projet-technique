import 'dart:io';

import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'TakePictureScreen.dart';
import 'main.dart';
import 'ChartPage.dart';
import 'database_service.dart';


class HomePage extends StatefulWidget {
  final String title;

  final CameraDescription camera;

  const HomePage({super.key, required this.title, required this.camera});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final _dbService = DatabaseService();
  List<Coin> _coins = [];

  @override
  void initState() {
    super.initState();
    _fetchCoins();
  }

  Future<void> _fetchCoins() async {
    try {
      final coins = await _dbService.read();
      setState(() {
        _coins = coins;
      });
    } catch (e) {
      print('Erreur lors de la récupération des pièces : $e');
    }
  }

  bool isValidURL(String url) {
    Uri? uri = Uri.tryParse(url);
    return uri != null && (uri.isScheme('http') || uri.isScheme('https'));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.primary,
        title: Text(widget.title),
      ),
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: _coins.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : ListView.builder(
          itemCount: _coins.length,
          itemBuilder: (context, index) {
            final coin = _coins[index];
            return Card(
              elevation: 4,
              margin: const EdgeInsets.symmetric(vertical: 10),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(15),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Année: ${coin.year}',
                      style: Theme.of(context)
                          .textTheme
                          .headlineSmall
                          ?.copyWith(
                        color: Theme.of(context).colorScheme.primary,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 5),
                    Text(
                      'Rareté: ${coin.rarity}',
                      style: Theme.of(context).textTheme.bodyLarge,
                    ),
                    const SizedBox(height: 5),
                    Text(
                      'Quantité: ${coin.quantity}',
                      style: Theme.of(context).textTheme.bodyLarge,
                    ),
                    const SizedBox(height: 5),
                    Text(
                      'Valeur: ${coin.value}€',
                      style: Theme.of(context).textTheme.bodyLarge,
                    ),
                    const SizedBox(height: 5),
                    if (isValidURL(coin.url))
                      Image.network(coin.url)
                    else
                      Image.file(File(coin.url)),

                    const SizedBox(height: 5),
                    TextButton(
                      style: TextButton.styleFrom(
                        foregroundColor: Theme.of(context).colorScheme.primary,
                      ),
                      onPressed: () { Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => TakePictureScreen(camera: widget.camera,)),
                      ); },
                      child: const Text('TextButton'),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => ChartPage()),
          );
        },
        child: Icon(Icons.show_chart),
      ),
    );
  }
}