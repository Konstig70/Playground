using System;
using System.Collections.Generic;
using MyStat;

namespace cs2_statTracker;

/// <summary>
/// Valikko olio
/// </summary>

public class Menu
{
    
    private Dictionary<string, Command> _commands = new Dictionary<string, Command>()
    {
        {"help", new HelpCommand()},
        {"exit", new ExitCommand()},
        
        
    };

    public Menu(Dictionary<string, Statistic> stats)
    {
        _commands.Add("kda", new KdaCommand(stats));
        _commands.Add("win", new WinLossCommand(stats));
        _commands.Add("weapons", new WeaponCommand(stats));
        
    }
    /// <summary>
    /// Metodi käyttäjän syötteen tulkinnalle
    /// </summary>
    /// <param name="userInput">Syöte</param>
    public void UiAction(string userInput)
    {
        if (_commands.TryGetValue(userInput, out Command command))
        {
            Clear();
            command.Action();
        }
        else
        {
            Console.WriteLine("No matches found, try again.");
        }
        Stop();
        
    }

    /// <summary>
    /// Suoritetaan aina aluksi
    /// </summary>
    public void Start()
    {
        Console.WriteLine("Welcome to Counter-Strike 2 stat tracker!");
    }

    /// <summary>
    /// välitila, jotta käyttäjä saa tulkita rauhassa tilastoja sekä, jotta tilastot ja ns päävalikko saadaa eroteltua
    /// </summary>
    public void Stop()
    {
        Console.WriteLine(" ");
        Console.WriteLine("Press any key to return to Main Menu...");
        char c = Console.ReadKey().KeyChar; //Onko pelkkä ReadLine parempi?
        Console.Clear();
    }
    
    
    /// <summary>
    /// Tyhjentää konsolin jotta se ei täyty liikaa.
    /// </summary>
    public void Clear()
    {
        Console.Clear();
    }
    
}