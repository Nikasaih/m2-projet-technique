import 'dart:math';
import 'package:charts_flutter/flutter.dart' as charts;
import 'package:flutter/material.dart';
import 'database_service.dart';
import 'main.dart';

class ChartPage extends StatefulWidget {
  @override
  _ChartPageState createState() => _ChartPageState();
}

class _ChartPageState extends State<ChartPage> {
  final DatabaseService _databaseService = DatabaseService();
  List<ChartData> _chartData = [];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    List<Coin> coins = await _databaseService.read();
    Map<DateTime, double> valueTotals = {};

    for (Coin coin in coins) {
      DateTime date = coin.dateAdd.toDate();
      double value = (coin.value * coin.quantity).toDouble();

      if (valueTotals.containsKey(date)) {
        valueTotals[date] = valueTotals[date]! + value;
      } else {
        valueTotals[date] = value;
      }
    }

    _chartData = valueTotals.entries.map((entry) {
      return ChartData(entry.key, entry.value, entry.key);
    }).toList();

    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    double maxValue = _chartData.map((data) => data.totalValue).reduce(max);
    double minValue = _chartData.map((data) => data.totalValue).reduce(min);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Graphique de valeur totale'),
      ),
      body: _chartData.isNotEmpty
          ? charts.TimeSeriesChart(
        _createSeries(),
        animate: true,
        dateTimeFactory: const charts.LocalDateTimeFactory(),
        domainAxis: const charts.DateTimeAxisSpec(
          renderSpec: charts.SmallTickRendererSpec(
            // Tick and Label styling here.
            labelStyle: charts.TextStyleSpec(
              fontSize: 12, // size in Pts.
              color: charts.MaterialPalette.black,
            ),
            // Change the line colors to match text color.
            lineStyle: charts.LineStyleSpec(
              color: charts.MaterialPalette.black,
            ),
          ),
          tickFormatterSpec: charts.AutoDateTimeTickFormatterSpec(
            day: charts.TimeFormatterSpec(
              format: 'd/M/y', // use this format
              transitionFormat: 'd/M/y', // use this format
            ),
          ),
        ),
        primaryMeasureAxis: charts.NumericAxisSpec(
          renderSpec: const charts.GridlineRendererSpec(
            labelStyle: charts.TextStyleSpec(
              fontSize: 12,
              color: charts.MaterialPalette.black,
            ),
          ),
          viewport: charts.NumericExtents(minValue / 5, maxValue * 1.2),
        ),
      )
          : const Center(child: CircularProgressIndicator()),
    );
  }

  List<charts.Series<ChartData, DateTime>> _createSeries() {
    return [
      charts.Series<ChartData, DateTime>(
        id: 'Total Value',
        data: _chartData,
        domainFn: (ChartData cd, _) => cd.dateAdd,
        measureFn: (ChartData cd, _) => cd.totalValue,
      )
    ];
  }
}

class ChartData {
  final DateTime date;
  final DateTime dateAdd;
  final double totalValue;

  ChartData(this.date, this.totalValue, this.dateAdd);
}