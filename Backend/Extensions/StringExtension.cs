using System.Text;

namespace Backend.Extensions;

using System.Security.Cryptography;

public static class StringExtension
{
    public static bool IsNullOrEmpty(this string str)
    {
        return string.IsNullOrEmpty(str);
    }

    public static bool IsNotNullOrEmpty(this string str)
    {
        return !string.IsNullOrEmpty(str);
    }
    public static string ToSha256(this string input)
    {
        return string.Join("", SHA256.Create().ComputeHash(Encoding.UTF8.GetBytes(input)).Select(x => x.ToString("x2")));
    }
}