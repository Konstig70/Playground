using System;
using cs2_statTracker;

namespace MyStat;

public class Statistic
{
    private string _name;
    private int _value;
    

    public Statistic(int value, string name)
    {
        _value = value;
        _name = name;
    }
    
    

    public void PrintRatio(Statistic stat)
    {
        decimal ratio = Convert.ToDecimal(stat.GetValue()) / Convert.ToDecimal(_value); //Tämä voisi periaatteessa olla attributti, mutta vaatiiko?
        Console.Write(ratio.ToString("0.000"));
    }
    
    public void RatioFromDifference(Statistic stat)
    {
        int difference = stat.GetValue() - _value;
        decimal ratio = Convert.ToDecimal(_value) / Convert.ToDecimal(difference);
        Console.WriteLine(ratio.ToString("0.000"));
    }

    public void PrintValue()
    {
        Console.Write(_value);
    }

    public void PrintName()
    {
        Console.Write(_name);
    }
    
    ///<summary>
    ///Tarvitaan, jotta tilaston lista pääsee käsiksi sen alkioiden attribuutteihin 
    /// </summary>    
    protected internal int GetValue()
    {
        return _value;
    }

    protected internal string GetName()
    {
        return _name;
    }
    
}