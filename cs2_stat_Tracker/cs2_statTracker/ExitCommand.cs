using System;

namespace cs2_statTracker;

/// <summary>
/// Poistumis komento ohjelman sammuttamista varten
/// </summary>
public class ExitCommand: Command
{
    public void Action()
    {
        Console.WriteLine("Shutting down...");
        Environment.Exit(0);
    }
}