using System;
using System.Collections.Generic;
using System.Linq;
using cs2_statTracker;

namespace MyStat;
public static class ListExtensions
{
    /// <summary>
    /// Oma versio listan sort metodista, joka lajittelee tilastot value kentän suuruuden perusteella, suurin ensimmäisenä
    /// </summary>
    /// <param name="stats">lista, jota tutkitaan</param>
    /// <returns>lajitellun listan</returns>
    public static List<Statistic> MySort(this List<Statistic> stats)
    {
        List<Statistic> sorted = new List<Statistic>();
        List<int> tapot = new List<int>();
        List<string> nimet = new List<string>();
        Statistic temp;
        foreach (Statistic stat in stats)
        {
            tapot.Add(stat.GetValue());
            nimet.Add(stat.GetName());
        }
        tapot.Sort();
        foreach (int tappo in tapot)
        {
            temp = new Statistic(tappo, stats.SearchName(tappo));
            sorted.Add(temp);
        }
        return sorted;
    }

    /// <summary>
    /// Hakee listasta tietyllä nimellä olevaa tilastoa sen arvon perusteella
    /// </summary>
    /// <param name="stats">tutkittava lista</param>
    /// <param name="value">tilaston arvo, jonka nimeä etsitään</param>
    /// <returns></returns>
    private static string SearchName(this List<Statistic> stats, int value) //Laitoin tämän yksityiseksi, sillä se palauttaa suoraan tilaston attribuutin
    {
        foreach (var stat in stats)
        {
            if (stat.GetValue() == value)
            {
                return stat.GetName();           
            }
        }
        return null;
    }
}