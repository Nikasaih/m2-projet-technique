import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:front/HomePage.dart';
import 'dart:io';

import 'database_service.dart';
import 'main.dart';

class AddCoin extends StatelessWidget {
  final String imagePath;

  AddCoin({super.key, required this.imagePath, required this.camera});

  final _formKey = GlobalKey<FormState>();
  final _yearController = TextEditingController();
  final _rarityController = TextEditingController();
  final _quantityController = TextEditingController();
  final _valueController = TextEditingController();
  final _dbService = DatabaseService();
  final CameraDescription camera;

  void writeInDb(coin) async {
    await _dbService.write(coin);
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Add Coin')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              Image.file(File(imagePath)),
              TextFormField(
                controller: _yearController,
                decoration: const InputDecoration(labelText: 'Année'),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return "Veuillez entrer l'année";
                  }
                  return null;
                },
              ),
              TextFormField(
                controller: _rarityController,
                decoration: const InputDecoration(labelText: 'Rareté'),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Veuillez entrer la rareté';
                  }
                  return null;
                },
              ),
              TextFormField(
                controller: _quantityController,
                decoration: const InputDecoration(labelText: 'Quantité'),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Veuillez entrer la quantité';
                  }
                  return null;
                },
              ),
              TextFormField(
                controller: _valueController,
                decoration: const InputDecoration(labelText: 'Valeur'),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Veuillez entrer la valeur';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () {
                  if (_formKey.currentState!.validate()) {
                    final coin = Coin(
                      year: int.parse(_yearController.text),
                      rarity: _rarityController.text,
                      quantity: int.parse(_quantityController.text),
                      value: int.parse(_valueController.text),
                      url: imagePath,
                    );

                    writeInDb(coin);

                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => HomePage(title: 'Collection de Pièces', camera: camera)),
                    );
                  }
                  else {

                  }
                },
                child: const Text('Add coin'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
