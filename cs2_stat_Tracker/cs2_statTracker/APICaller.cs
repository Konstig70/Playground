using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Xml.Linq;
using System.Xml;
using System.Net.Http;
using System.Threading.Tasks;

namespace cs2_statTracker;

public class APICaller : IDisposable
{
    private static string APICall;
    private bool _disposed = false;
    private HttpClient client = new HttpClient();

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
            Console.WriteLine(e.Message);
            Console.WriteLine("exception occured when calling API, most likely due to wrong/invalid key/id. Try again.");
            Environment.Exit(-1);
        }
        finally
        {
            Dispose();
        }
        
    }
    /// <summary>
    /// destruktori
    /// </summary>
    ~APICaller()
    {
        Dispose(false);
    }

    /// <summary>
    /// Varmistetaan, että tietoja ei talletu tuhoamalla olio
    /// </summary>
    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    private void Dispose(bool disposing)
    {
        if (!_disposed)
        {
            if (disposing)
            {
                client?.Dispose();//Tuhotaan httpclient
            }
        }
        _disposed = true;
    }
}
