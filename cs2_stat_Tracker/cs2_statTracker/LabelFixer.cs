using System;
using System.Collections.Generic;
using cs2_statTracker;
namespace MyStat;



/// <summary>
/// xml-dokumentti sisältää vanhoja nimiä joillekkin tilastoille, joten tämä luokka korjaa nimet uusiksi.
/// Formatoidaan myös aseiden nimet isoilla kirjaimilla
/// </summary>
public class LabelFixer
{
    private static Dictionary<string,string> _constantNames = new()
    {
        {"hkp2000", "USP-S/P2000"},
        {"m4a1", "M4A4/M4A1-S"},
        {"deagle", "Desert Eagle"},
    }; //dictionaryssa avaimina toimii vanhat/huonot nimitykset tilastoille ja arvoina paremmat nimitykset.

    /// <summary>
    /// formatoi annetun merkkijonon
    /// </summary>
    /// <param name="stat"></param>
    /// <returns>formatoidun merkkijono</returns>
    public static string FixLabel(Statistic stat)
    {
        string content = stat.GetName();
        int firstIndex = content.IndexOf("_", StringComparison.Ordinal);
        content = content.Substring(content.IndexOf("_", firstIndex + 1, StringComparison.Ordinal) + 1);
        if (_constantNames.TryGetValue(content, out string formattedName))
        {
            return formattedName; //Tässä tarkistetaan löytyykö formatoitavasta sisällöstä, jokin vanha/huono nimi. Jos löytyy niin palautetaan parempi
        }

        return content.ToUpper();//Jos nimi ei löydy niin palautetaan vain alkuperäinen nimi isoilla kirjaimilla
                
    }
}