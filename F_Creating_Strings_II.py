import math as m;
string = input();
n = len(string)

mp = {};
for i in string:
    if mp.get(i, 0) == 0:
        mp[i] = 1;
    else:
        mp[i] += 1;

leftRange = 1;
maxi = 0;
k = None;
for key in mp:    
    if mp[key] > maxi:
        maxi = mp[key];
        k = key;

leftRange = n - maxi;
mp[k] = 1;

ans = 1;
for i in range(leftRange):
    ans *= n;
    n -= 1;

facts = {};
for key in mp:
    if facts.get(mp[key], 0) == 0:
        facts[mp[key]] = m.factorial(mp[key]); 
    ans //= facts[mp[key]];
    
print(ans % (1000000007));  # 1000000007

"""

    (20 / 10) % 5
    
"""  