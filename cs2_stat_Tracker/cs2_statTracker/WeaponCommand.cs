using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows.Input;
using MyStat;

namespace cs2_statTracker;

/// <summary>
/// Ase tilastoja seuraava komento, tulostaa käyttäjälle 5 eniten tappoja omaavat aseita
/// </summary>

public class WeaponCommand : Command
{
    private Statistic[] _aseet; 

    /// <summary>
    /// Konstruktori
    /// </summary>
    /// <param name="stats">Dictionary, mistä haetaan tarvittavat tilastot</param>
    public WeaponCommand(Dictionary<string, Statistic> stats)
    {
        _aseet = new []{stats["top1"], stats["top2"], stats["top3"], stats["top4"], stats["top5"]};
    }
    
    public void Action()
    {
     Console.Write("Your deadliest weapons is ");
     Console.Write(LabelFixer.FixLabel(_aseet[0]));
     Console.Write(" with ");
     _aseet[0].PrintValue();
     Console.WriteLine(" kills.");
     Console.WriteLine("Your 5 highest kill count weapons are");
     foreach (Statistic ase in _aseet)
     {
         Console.Write(LabelFixer.FixLabel(ase));
         Console.Write(" with ");
         ase.PrintValue();
         Console.Write(" kills");
         Console.WriteLine("");
     }


    }
    
    
}