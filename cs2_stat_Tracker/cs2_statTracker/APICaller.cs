using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Xml.Linq;
using System.Xml;
using System.Net.Http;
using System.Threading.Tasks;

namespace cs2_statTracker;

public class APICaller
{
    //Steam web API avain on henkilökohtainen, jonka avulla pääsee käsiksi metodeihin, millä tilin voi kaapata, siksi se ei ole näkyvillä
    private static string APICall;

    public APICaller(string avain, string id)
    {
        APICall = "https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v2/?appid=730&key=" + avain + "&steamid=" + id + "&format=xml";
    }
    
    /// <summary>
    /// Kutsuu web API:a ja ottaa sisällön xml-dokumentin talteen merkkijonona
    /// </summary>
    /// <returns>palauttaa sisällön</returns>
    public async Task Call(XDocument doc)
    {
        try
        {
            HttpClient client = new HttpClient();
            using (HttpResponseMessage vastaus = await client.GetAsync(APICall))
            {
                vastaus.EnsureSuccessStatusCode();
                string vastausSisalto = await vastaus.Content.ReadAsStringAsync();
                doc = XDocument.Parse(vastausSisalto);
                doc.Save("../../../../stats.xml");
                
            }
            
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
        
    }
    
}