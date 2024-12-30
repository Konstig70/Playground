using System;

namespace cs2_statTracker;

/// <summary>
/// Kertoo käytettävissä olevat komennot
/// </summary>
public class HelpCommand : Command
{
    public void Action()
    {
        Console.WriteLine("Supported commands:");
        Console.WriteLine("help:     Opens help menu");
        Console.WriteLine("exit:     Exits the program");
        Console.WriteLine("kda:      Shows your Kda-ratio");
        Console.WriteLine("win:      Shows your win/loss-ratio");
        Console.WriteLine("weapons:  Shows your weapon statistics");
    }
}