using System;
using System.Collections.Generic;
using System.Globalization;
using MyStat;

namespace cs2_statTracker;
/// <summary>
/// Command rajapinnan täyttävä luokka
/// Etsii tapot sekä kuolemat ja sitten laskee niiden avulla suhteen
/// </summary>

public class KdaCommand : Command
{
    private Statistic _kills;
    private Statistic _deaths;

    /// <summary>
    /// Konstruktori
    /// </summary>
    /// <param name="stats">Dictionary, mistä haetaan tarvittavat tilastot</param>
    public KdaCommand(Dictionary<string, Statistic> stats)
    {
        _kills = stats["total_kills"];
        _deaths = stats["total_deaths"];
    }
    public void Action()
    {
        Console.Write("You have acquired ");  
      _kills.PrintValue(); 
      Console.Write(" kills and ");
     _deaths.PrintValue();
     Console.Write(" deaths.");
     Console.WriteLine("");
     Console.Write("With a kda-ratio of ");
     _deaths.PrintRatio(_kills);
     Console.WriteLine("");     
    }

    
    

    
}