import 'package:cloud_firestore/cloud_firestore.dart';
import 'main.dart';

class DatabaseService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  Future<List<Coin>> read() async {
    try {
      QuerySnapshot querySnapshot = await _firestore.collection("Coins").get();
      return querySnapshot.docs.map((doc) {
        return Coin.fromFirestore(doc);
      }).toList();
    } catch (e) {
      print("Erreur lors de la lecture des données: $e");
      return [];
    }
  }
}
