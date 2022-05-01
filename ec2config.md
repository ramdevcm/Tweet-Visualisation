1. Instance ID
- i-0c2be669df1603c46

2. Open an SSH client.

3. Locate your private key file. The key used to launch this instance is twitscape.pem

4. Run this command, if necessary, to ensure your key is not publicly viewable.
 * chmod 400 twitscape.pem 

5. Connect to your instance using its Public DNS:
 * ec2-3-111-51-134.ap-south-1.compute.amazonaws.com


Example:
ssh -i "twitscape.pem" ubuntu@ec2-3-111-51-134.ap-south-1.compute.amazonaws.com
