"use client"

import { useState } from "react"
import { Tiny5Button } from "@/components/ui/tiny5-button"
import Link from "next/link"
import { useMusicPlayer } from "@/components/music-player-provider"
import { Copy, Check } from 'lucide-react'

interface Script {
  id: string
  name: string
  description: string
  commands: string[]
  category: string
}

const scripts: Script[] = [
  {
    id: "pterodactyl",
    name: "Pterodactyl Installer",
    description: "Game server management panel installation",
    category: "Server Management",
    commands: ["bash <(curl -s https://pterodactyl-installer.se)"]
  },
  {
    id: "nvm",
    name: "Node Version Manager (NVM)",
    description: "Install and manage Node.js versions",
    category: "Development",
    commands: [
      "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash",
      "export NVM_DIR=\"$([ -z \"${XDG_CONFIG_HOME-}\" ] && printf %s \"${HOME}/.nvm\" || printf %s \"${XDG_CONFIG_HOME}/nvm\")\"",
      "[ -s \"$NVM_DIR/nvm.sh\" ] && \\. \"$NVM_DIR/nvm.sh\"",
      "nvm install node"
    ]
  },
  {
    id: "playit",
    name: "Playit.gg Tunnel",
    description: "Expose local server to internet with port forwarding",
    category: "Networking",
    commands: [
      "curl -SsL https://playit-cloud.github.io/ppa/key.gpg | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/playit.gpg >/dev/null",
      "echo \"deb [signed-by=/etc/apt/trusted.gpg.d/playit.gpg] https://playit-cloud.github.io/ppa/data ./\" | sudo tee /etc/apt/sources.list.d/playit-cloud.list",
      "sudo apt update",
      "sudo apt install playit"
    ]
  },
  {
    id: "ngrok",
    name: "Ngrok Tunnel",
    description: "Create secure introspectable tunnels to localhost",
    category: "Networking",
    commands: [
      "curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null",
      "echo \"deb https://ngrok-agent.s3.amazonaws.com buster main\" | sudo tee /etc/apt/sources.list.d/ngrok.list",
      "sudo apt update",
      "sudo apt install ngrok"
    ]
  },
  {
    id: "docker",
    name: "Docker Installation",
    description: "Container platform for building and deploying applications",
    category: "Containers",
    commands: [
      "curl -fsSL https://get.docker.com -o get-docker.sh",
      "sudo sh get-docker.sh",
      "sudo usermod -aG docker $USER",
      "newgrp docker"
    ]
  },
  {
    id: "rust",
    name: "Rust Programming Language",
    description: "Install Rust and the Cargo package manager",
    category: "Development",
    commands: [
      "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh",
      "source $HOME/.cargo/env"
    ]
  },
  {
    id: "github-cli",
    name: "GitHub CLI",
    description: "Command-line interface for GitHub",
    category: "Development",
    commands: [
      "curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg",
      "echo \"deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages focal main\" | sudo tee /etc/apt/sources.list.d/github-cli.list",
      "sudo apt update",
      "sudo apt install gh"
    ]
  },
  {
    id: "certbot",
    name: "Certbot (Let's Encrypt)",
    description: "Automatic SSL/TLS certificate generation",
    category: "Security",
    commands: [
      "sudo apt install certbot python3-certbot-nginx",
      "sudo certbot certonly --nginx -d yourdomain.com"
    ]
  },
  {
    id: "pm2",
    name: "PM2 Process Manager",
    description: "Production runtime manager for Node.js applications",
    category: "Development",
    commands: [
      "npm install -g pm2",
      "pm2 startup",
      "pm2 save"
    ]
  },
  {
    id: "redis",
    name: "Redis Server",
    description: "In-memory data structure store",
    category: "Databases",
    commands: [
      "curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg",
      "echo \"deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main\" | sudo tee /etc/apt/sources.list.d/redis.list",
      "sudo apt-get update",
      "sudo apt-get install redis"
    ]
  },
  {
    id: "postgres",
    name: "PostgreSQL Database",
    description: "Advanced open-source relational database",
    category: "Databases",
    commands: [
      "sudo sh -c 'echo \"deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main\" > /etc/apt/sources.list.d/pgdg.list'",
      "wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -",
      "sudo apt-get update",
      "sudo apt-get install postgresql postgresql-contrib"
    ]
  },
  {
    id: "bun",
    name: "Bun JavaScript Runtime",
    description: "Fast all-in-one JavaScript runtime",
    category: "Development",
    commands: [
      "curl -fsSL https://bun.sh/install | bash",
      "source ~/.bashrc"
    ]
  },
  {
    id: "deno",
    name: "Deno Runtime",
    description: "Modern runtime for JavaScript and TypeScript",
    category: "Development",
    commands: [
      "curl -fsSL https://deno.land/x/install/install.sh | sh",
      "export DENO_INSTALL=\"$HOME/.deno\"",
      "export PATH=\"$DENO_INSTALL/bin:$PATH\""
    ]
  },
  {
    id: "wireguard",
    name: "WireGuard VPN",
    description: "Simple and fast VPN implementation",
    category: "Networking",
    commands: [
      "sudo apt-get install wireguard wireguard-tools",
      "sudo wg-quick up wg0"
    ]
  },
  {
    id: "mongodb",
    name: "MongoDB Database",
    description: "NoSQL document database",
    category: "Databases",
    commands: [
      "curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -",
      "echo \"deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse\" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list",
      "sudo apt-get update",
      "sudo apt-get install -y mongodb-org"
    ]
  },
  {
    id: "mysql",
    name: "MySQL Database",
    description: "Popular relational database management system",
    category: "Databases",
    commands: [
      "sudo apt-get update",
      "sudo apt-get install mysql-server",
      "sudo mysql_secure_installation"
    ]
  },
  {
    id: "nginx",
    name: "Nginx Web Server",
    description: "High-performance web server and reverse proxy",
    category: "Server Management",
    commands: [
      "sudo apt-get update",
      "sudo apt-get install nginx",
      "sudo systemctl start nginx",
      "sudo systemctl enable nginx"
    ]
  },
  {
    id: "apache",
    name: "Apache Web Server",
    description: "Open-source web server",
    category: "Server Management",
    commands: [
      "sudo apt-get update",
      "sudo apt-get install apache2",
      "sudo systemctl start apache2",
      "sudo a2enmod rewrite"
    ]
  },
  {
    id: "tmux",
    name: "Tmux Terminal Multiplexer",
    description: "Terminal multiplexer for managing multiple sessions",
    category: "Development",
    commands: [
      "sudo apt-get install tmux",
      "tmux new-session -d -s myserver"
    ]
  },
  {
    id: "openssh",
    name: "OpenSSH Server",
    description: "Secure shell server for remote access",
    category: "Security",
    commands: [
      "sudo apt-get install openssh-server",
      "sudo systemctl start ssh",
      "sudo systemctl enable ssh"
    ]
  },
  {
    id: "fail2ban",
    name: "Fail2Ban Security",
    description: "Intrusion prevention software framework",
    category: "Security",
    commands: [
      "sudo apt-get install fail2ban",
      "sudo systemctl start fail2ban",
      "sudo systemctl enable fail2ban"
    ]
  },
  {
    id: "zsh",
    name: "Zsh Shell",
    description: "Powerful shell with interactive completion",
    category: "Development",
    commands: [
      "sudo apt-get install zsh",
      "chsh -s /bin/zsh",
      "curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh | sh"
    ]
  },
  {
    id: "ffmpeg",
    name: "FFmpeg Media Toolkit",
    description: "Multimedia framework for audio and video",
    category: "Development",
    commands: [
      "sudo apt-get update",
      "sudo apt-get install ffmpeg",
      "ffmpeg -version"
    ]
  },
  {
    id: "git",
    name: "Git Version Control",
    description: "Distributed version control system",
    category: "Development",
    commands: [
      "sudo apt-get install git",
      "git config --global user.name \"Your Name\"",
      "git config --global user.email \"your@email.com\""
    ]
  },
  {
    id: "python3",
    name: "Python 3 Development",
    description: "Python programming language and dev tools",
    category: "Development",
    commands: [
      "sudo apt-get update",
      "sudo apt-get install python3 python3-pip python3-venv",
      "pip3 install --upgrade pip"
    ]
  },
  {
    id: "golang",
    name: "Go Programming Language",
    description: "Statically typed compiled programming language",
    category: "Development",
    commands: [
      "curl -OL https://go.dev/dl/go1.21.0.linux-amd64.tar.gz",
      "sudo tar -C /usr/local -xzf go1.21.0.linux-amd64.tar.gz",
      "export PATH=$PATH:/usr/local/go/bin"
    ]
  },
  {
    id: "nodejs",
    name: "Node.js Installation",
    description: "JavaScript runtime for server-side development",
    category: "Development",
    commands: [
      "sudo apt-get update",
      "sudo apt-get install nodejs npm",
      "npm install -g npm@latest"
    ]
  },
  {
    id: "docker-compose",
    name: "Docker Compose",
    description: "Tool for defining and running multi-container applications",
    category: "Containers",
    commands: [
      "curl -L https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose",
      "sudo chmod +x /usr/local/bin/docker-compose",
      "docker-compose --version"
    ]
  },
  {
    id: "podman",
    name: "Podman Container Engine",
    description: "Daemonless container engine alternative to Docker",
    category: "Containers",
    commands: [
      "sudo apt-get install podman",
      "podman --version"
    ]
  },
  {
    id: "letsencrypt-auto-renewal",
    name: "Let's Encrypt Auto-Renewal",
    description: "Automatic SSL certificate renewal with cron",
    category: "Security",
    commands: [
      "sudo certbot renew --dry-run",
      "sudo certbot renew",
      "(sudo crontab -l 2>/dev/null; echo '0 12 * * * /usr/bin/certbot renew --quiet') | sudo crontab -"
    ]
  }
]

export default function IS01Page() {
  const { isAllRed } = useMusicPlayer()
  const [selectedScript, setSelectedScript] = useState<string | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>("All")

  const textColor = isAllRed ? 'text-red-500' : 'text-white'
  const borderColor = isAllRed ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.5)'

  const categories = ["All", ...new Set(scripts.map(s => s.category))]
  const filteredScripts = filterCategory === "All" 
    ? scripts 
    : scripts.filter(s => s.category === filterCategory)

  const currentScript = selectedScript 
    ? scripts.find(s => s.id === selectedScript)
    : null

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <main className="min-h-screen bg-black relative flex items-center justify-center p-4 pt-24">
      <div className="absolute top-8 left-8 z-10">
        <Link href="/code">
          <Tiny5Button className={`${textColor} hover:text-red-500`}>BACK</Tiny5Button>
        </Link>
      </div>

      <div className="flex flex-col gap-8 items-center z-10 max-w-7xl w-full">
        <div className={`${textColor} opacity-50 text-2xl text-center`} style={{ fontFamily: 'var(--font-tiny5)' }}>
          INSTALLATION SCRIPTS
        </div>

        {!selectedScript ? (
          <>
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1 border transition-opacity ${
                    filterCategory === cat 
                      ? textColor + ' opacity-100' 
                      : textColor + ' opacity-50 hover:opacity-75'
                  }`}
                  style={{ 
                    fontFamily: 'var(--font-tiny5)',
                    borderColor: filterCategory === cat ? 'currentColor' : borderColor
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Scripts Grid */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredScripts.map(script => (
                <button
                  key={script.id}
                  onClick={() => setSelectedScript(script.id)}
                  className={`flex flex-col gap-2 p-4 border transition-all hover:opacity-100 ${textColor} opacity-50 hover:bg-opacity-5 hover:bg-white text-left`}
                  style={{ borderColor }}
                >
                  <div className="text-sm opacity-75" style={{ fontFamily: 'var(--font-tiny5)' }}>
                    {script.category}
                  </div>
                  <div className="font-bold" style={{ fontFamily: 'var(--font-tiny5)' }}>
                    {script.name}
                  </div>
                  <div className="text-xs opacity-50" style={{ fontFamily: 'var(--font-tiny5)' }}>
                    {script.description}
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : currentScript ? (
          <>
            {/* Script Detail View */}
            <button
              onClick={() => setSelectedScript(null)}
              className={`self-start ${textColor} hover:text-red-500 transition-colors`}
              style={{ fontFamily: 'var(--font-tiny5)' }}
            >
              ← BACK
            </button>

            <div className="w-full flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className={`${textColor} opacity-75 text-sm`} style={{ fontFamily: 'var(--font-tiny5)' }}>
                  {currentScript.category}
                </div>
                <div className={`${textColor} text-xl`} style={{ fontFamily: 'var(--font-tiny5)' }}>
                  {currentScript.name}
                </div>
                <div className={`${textColor} opacity-50`} style={{ fontFamily: 'var(--font-tiny5)' }}>
                  {currentScript.description}
                </div>
              </div>

              {/* Commands */}
              <div className="flex flex-col gap-3">
                {currentScript.commands.map((cmd, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-3 border ${textColor} opacity-50 hover:opacity-100 transition-opacity group`}
                    style={{ borderColor }}
                  >
                    <button
                      onClick={() => handleCopy(cmd, idx)}
                      className={`mt-1 ${copiedIndex === idx ? 'text-green-500' : textColor} hover:text-red-500 transition-colors flex-shrink-0`}
                      title="Copy to clipboard"
                    >
                      {copiedIndex === idx ? (
                        <Check size={16} />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                    <code className="font-mono text-xs flex-1 break-all" style={{ fontFamily: 'monospace' }}>
                      {cmd}
                    </code>
                  </div>
                ))}
              </div>

              {/* Copy All Button */}
              <Tiny5Button
                onClick={() => {
                  const allCmds = currentScript.commands.join('\n')
                  navigator.clipboard.writeText(allCmds)
                  setCopiedIndex(-1)
                  setTimeout(() => setCopiedIndex(null), 2000)
                }}
                className={`${textColor} hover:text-red-500`}
              >
                {copiedIndex === -1 ? 'COPIED ALL' : 'COPY ALL COMMANDS'}
              </Tiny5Button>
            </div>
          </>
        ) : null}

        <div className={`${textColor} opacity-30 text-sm mt-8`} style={{ fontFamily: 'var(--font-tiny5)' }}>
          CODE: IS-01
        </div>
      </div>
    </main>
  )
}
