using System;
using System.Text;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Xml.Linq;
using cs2_statTracker;
using MyStat;


/// @author konst
/// @version 15.10.2024
/// <summary>
/// tilastojen seuranta ohjelma Counter-Strike 2 peliä varten. Seuratut tilastot:
/// tappo/kuolema suhde, voitto suhde, aseiden tapot tms.
/// </summary>
public class TrackerApp
{
    /// <summary>
    /// Itse "sovelluksen"/ohjelman aloitus
    /// </summary>
    public static async Task Main()
    {
        Console.WriteLine("Please enter your steamId: ");
        string steamId = Console.ReadLine();
        Console.Clear();
        Console.Write("Please enter your steam web API key: ");
        string steamApiKey = Console.ReadLine();
        Console.Clear();
        APICaller apiCaller = new APICaller(steamApiKey, steamId);
        await apiCaller.Call(new XDocument());
        //Tilastot, joita halutaan seurata
        string[] nimet = { "total_kills", "total_deaths","total_matches_won", "total_matches_played" };
        Dictionary<string, Statistic> stats = XMLHandler.FindStatistics(nimet);
        Menu m = new Menu(stats);
        while (true) //Estää ohjelmaa loppumasta
        {
            m.Start();
            m.UiAction(Console.ReadLine());
            m.Clear();
        }
        
    }
}