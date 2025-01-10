using System;
using System.IO;

namespace Calender{

public class notification
{
    private string message = string.Empty;
    private string date = string.Empty;
    private static string PATHTONOTES = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Notes.txt"); 


    public void makeNote(string m, string d)
    {
        message = m;
        date = d;
    }
    
    public void saveNote()
    {
        File.AppendAllText(PATHTONOTES,  date + " " + message + Environment.NewLine);
    }
 
}
}