import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:front/TakePictureScreen.dart';
import 'main.dart';

class HomePage extends StatefulWidget {
  final String title;

  final CameraDescription camera;

  const HomePage({super.key, required this.title, required this.camera});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final List<Coin> _coins = [
    Coin(year: 1990, rarity: 'Commune', quantity: 100, value: 50),
    Coin(year: 1889, rarity: 'Rare', quantity: 5, value: 1000),
    Coin(year: 2020, rarity: 'Très commune', quantity: 5000, value: 5),
    Coin(year: 1965, rarity: 'Peu commune', quantity: 50, value: 150),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.primary,
        title: Text(widget.title),
      ),
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: ListView.builder(
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
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
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
                    TextButton(
                      style: TextButton.styleFrom(
                        foregroundColor: Theme.of(context).colorScheme.primary,
                      ),
                      onPressed: () { Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => TakePictureScreen(camera: widget.camera,)),
                      ); },
                      child: const Text('TextButton'),
                    )
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}

