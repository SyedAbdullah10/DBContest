#include <bits/stdc++.h>
using namespace std;

#define ll long long
#define ull unsigned long long
#define ld long double
#define PI 3.1415926535897932384626433832795l
#define pb push_back
#define forn(i, a, n) for (int i = a; i < n; i++)
#define forrn(i, a, n) for (int i = n - 1; i >= a; i--)
#define inputArr(arr) forn(i, 0, arr.size()) cin >> arr[i]
#define inputArrRange(arr, a, b) forn(i, a, b) cin >> arr[i]
#define printArr(arr) forn(i, 0, arr.size()) cout << arr[i] << " "
#define printArrRange(arr, a, b) forn(i, a, b) cout << arr[i] << " "
#define sz(a) a.size()
#define all(ans) ans.begin(), ans.end()
#define lcm(a, b) ((a * b) / __gcd(a, b))
#define gcd(a, b) (__gcd(a, b))
#define um unordered_map
#define mp make_pair
#define here cout << "here" << endl;
#define print(ans) cout << ans << endl
#define nl cout << endl
#define min_heap(T) priority_queue<T, vector<T>, greater<T>>
#define max_heap(T) priority_queue<T>
#define YesNo(ans) cout << (ans ? "Yes" : "No") << endl;
#define YESNO(ans) cout << (ans ? "YES" : "NO") << endl;

typedef pair<int, int> pii;
typedef pair<ll, ll> pll;
typedef vector<int> vi;
typedef vector<ll> vl;
typedef vector<pii> vpii;
typedef vector<pll> vpll;
typedef vector<vi> vvi;
typedef vector<vl> vvl;
typedef vector<char> vc;
typedef vector<vc> vvc;
typedef vector<string> vs;
typedef vector<vs> vvs;
typedef vector<bool> vb;

void solve()
{
    
    ll n;
    cin >> n;
    ll ones = __builtin_popcount(n);

}

int main()
{
    ios_base::sync_with_stdio(0);
    cin.tie(0);
    cout.tie(0);
    int tc = 1;
    // cin >> tc;
    for (int t = 1; t <= tc; t++)
    {
        solve();
    }
}