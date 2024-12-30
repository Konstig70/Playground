using System;
using System.Collections.Generic;
using System.Linq;
using MyStat;

namespace cs2_statTracker;

public class WinLossCommand : Command
{

    /// <summary>
    /// Hakee pelien voitot ja tappiot, laskee niiden suhteen sekä tulostaa sen
    /// </summary>
    private Statistic _wins;
    private Statistic _matches;

    /// <summary>
    /// Konstruktori
    /// </summary>
    /// <param name="stats">Dictionary, mistä haetaan tarvittavat tilastot</param>
    public WinLossCommand(Dictionary<string, Statistic> stats)
    {
        _wins = stats["total_matches_won"];
        _matches = stats["total_matches_played"];
    }
    
    public void Action()
    {
        Console.Write("You have won ");
        _wins.PrintValue();
        Console.Write(" matches out of ");
        _matches.PrintValue();
        Console.WriteLine("");
        Console.Write("With a win/loss ratio of ");
        _wins.RatioFromDifference(_matches);
        Console.WriteLine("");
        
    }
    
}