using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;
using System.IO;
using System.Threading.Tasks;
using System.Xml.Linq;
using MyStat;
namespace cs2_statTracker;

/// <summary>
/// Luokka, joka hoitaa kaiken xml-dokumentin käsittelyn
/// </summary>
public class XMLHandler
{
    
    /// <summary>
    /// Etii kaikki tilastot, nimet taulukossa, sekä ase tilastot
    /// </summary>
    /// <param name="nimet">Etsittyjen tilastojen nimet</param>
    /// <returns></returns>
    public static Dictionary<string, Statistic> FindStatistics(string[] nimet)
    {
        //Vaihe 1 haetaan kaikki tilastot, jotka ovat nimeet taulukossa
        XDocument xmlDoc = XDocument.Load("../../../../stats.xml");
        IEnumerable<XElement> allStats = xmlDoc.Descendants("stat");
        Dictionary<string, Statistic> stats = new Dictionary<string, Statistic>();
        int value = 0;
        foreach (var nimi in nimet)
        {
            XElement etsittyTilasto = allStats.FirstOrDefault(stat => stat.Element("name")?.Value == nimi); 
            if (etsittyTilasto != null)
            {
                string tilasto = etsittyTilasto.Element("value")?.Value;
                value = Convert.ToInt32(tilasto);
                stats.Add(nimi, new Statistic(value, nimi));
                
            }
           
        }
        //Vaihe 2, jossa haetaan 5 asetta, joilla eniten tappoja
        List<Statistic> aseTilastot = new List<Statistic>();
        var aseet = allStats.Where(stat => stat.Element("name") != null 
        && stat.Element("name").Value.StartsWith("total_kills_") 
        && stat.Element("name")?.Value != "total_kills_headshot"
        && stat.Element("name")?.Value != "total_kills_enemy_weapon");
        foreach (var stat in aseet)
        {
            string ase =  stat.Element("name")?.Value;
            XElement etsittyTilasto = allStats.FirstOrDefault(stat => stat.Element("name")?.Value == ase); 
            if (etsittyTilasto != null)
            {
                string tilasto = etsittyTilasto.Element("value")?.Value;
                value = Convert.ToInt32(tilasto);
                
            }
            aseTilastot.Add(new Statistic(value, ase));
        }

        aseTilastot = aseTilastot.MySort();
        stats.Add("top1", aseTilastot[^1]);
        stats.Add("top2", aseTilastot[^2]);
        stats.Add("top3", aseTilastot[^3]);
        stats.Add("top4", aseTilastot[^4]);
        stats.Add("top5", aseTilastot[^5]);

        return stats;
    }
    
    
    
    
}