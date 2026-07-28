using System;
using System.Diagnostics;
using System.IO;
using System.ServiceProcess;
using System.Text;
using System.Threading;

public class AppGPPServiceHost : ServiceBase
{
    private Process _serverProcess;
    private Thread _watcherThread;
    private volatile bool _stopping;
    private string _appRoot;
    private string _logPath;

    public AppGPPServiceHost()
    {
        ServiceName = "AppGPP-Service";
        CanStop = true;
        CanShutdown = true;
        CanPauseAndContinue = false;
        AutoLog = false;
    }

    public static void Main(string[] args)
    {
        if (args != null && Array.Exists(args, item => string.Equals(item, "--console", StringComparison.OrdinalIgnoreCase)))
        {
            var service = new AppGPPServiceHost();
            service.RunAsConsole();
            return;
        }

        ServiceBase.Run(new AppGPPServiceHost());
    }

    private void RunAsConsole()
    {
        try
        {
            OnStart(Array.Empty<string>());
            Console.WriteLine("AppGPP-ServiceHost executando. Pressione Ctrl+C para encerrar.");
            Console.CancelKeyPress += (sender, e) =>
            {
                e.Cancel = true;
                Stop();
            };
            while (!_stopping)
            {
                Thread.Sleep(500);
            }
        }
        catch (Exception ex)
        {
            Log("Falha no modo console: " + ex.Message);
            throw;
        }
        finally
        {
            OnStop();
        }
    }

    protected override void OnStart(string[] args)
    {
        var baseDir = AppDomain.CurrentDomain.BaseDirectory.TrimEnd(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar);
        _appRoot = Path.GetFullPath(Path.Combine(baseDir, ".."));
        _logPath = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData),
            "AppGPP",
            "service-host.log"
        );

        Directory.CreateDirectory(Path.GetDirectoryName(_logPath));
        Log("Iniciando host de servico.");
        Log("Raiz detectada: " + _appRoot);
        StartServer();

        _watcherThread = new Thread(WatchServer)
        {
            IsBackground = true
        };
        _watcherThread.Start();
    }

    protected override void OnStop()
    {
        _stopping = true;
        Log("Encerrando host de servico.");
        StopServer();
    }

    protected override void OnShutdown()
    {
        OnStop();
        base.OnShutdown();
    }

    private void StartServer()
    {
        var standaloneServer = Path.Combine(_appRoot, ".next", "standalone", "server.js");
        if (!File.Exists(standaloneServer))
        {
            throw new InvalidOperationException("Servidor standalone nao encontrado: " + standaloneServer);
        }

        EnsureStandaloneStaticAssets();

        var nodeExe = Path.Combine(_appRoot, "runtime", "node", "node.exe");
        if (!File.Exists(nodeExe))
        {
            nodeExe = "node";
        }
        Log("Node selecionado: " + nodeExe);
        Log("Servidor standalone: " + standaloneServer);

        var bindHost = "0.0.0.0";
        var port = "3000";
        var envPath = Path.Combine(_appRoot, "appgpp-server.env");
        if (File.Exists(envPath))
        {
            foreach (var line in File.ReadAllLines(envPath, Encoding.UTF8))
            {
                if (string.IsNullOrWhiteSpace(line))
                {
                    continue;
                }

                var trimmed = line.TrimStart();
                if (trimmed.StartsWith("#", StringComparison.Ordinal))
                {
                    continue;
                }

                var parts = line.Split(new[] { '=' }, 2);
                if (parts.Length != 2)
                {
                    continue;
                }

                var key = parts[0].Trim();
                var value = parts[1].Trim().Trim('"');
                if (string.IsNullOrWhiteSpace(value))
                {
                    continue;
                }

                if (string.Equals(key, "APPGPP_BIND_HOST", StringComparison.OrdinalIgnoreCase))
                {
                    bindHost = value;
                }
                else if (string.Equals(key, "APPGPP_PORT", StringComparison.OrdinalIgnoreCase))
                {
                    port = value;
                }
            }
        }

        FreePortIfOccupied(port);

        var startInfo = new ProcessStartInfo
        {
            FileName = nodeExe,
            Arguments = Quote(standaloneServer),
            WorkingDirectory = _appRoot,
            UseShellExecute = false,
            CreateNoWindow = true,
            RedirectStandardOutput = true,
            RedirectStandardError = true
        };

        startInfo.EnvironmentVariables["HOSTNAME"] = bindHost;
        startInfo.EnvironmentVariables["PORT"] = port;
        startInfo.EnvironmentVariables["NODE_ENV"] = "production";

        _serverProcess = new Process
        {
            StartInfo = startInfo,
            EnableRaisingEvents = true
        };
        _serverProcess.OutputDataReceived += (sender, e) => { if (!string.IsNullOrWhiteSpace(e.Data)) Log(e.Data); };
        _serverProcess.ErrorDataReceived += (sender, e) => { if (!string.IsNullOrWhiteSpace(e.Data)) Log(e.Data); };
        _serverProcess.Exited += (sender, e) =>
        {
            if (!_stopping)
            {
                Log("O servidor encerrou inesperadamente.");
                try { Stop(); } catch { }
            }
        };

        try
        {
            if (!_serverProcess.Start())
            {
                throw new InvalidOperationException("Nao foi possivel iniciar o processo do servidor.");
            }
        }
        catch (Exception ex)
        {
            Log("Falha ao iniciar o servidor: " + ex.Message);
            throw;
        }

        _serverProcess.BeginOutputReadLine();
        _serverProcess.BeginErrorReadLine();
        Log("PID do servidor: " + _serverProcess.Id);
        Log("Servidor iniciado: " + nodeExe + " " + standaloneServer);
    }

    private void EnsureStandaloneStaticAssets()
    {
        var sourceStatic = Path.Combine(_appRoot, ".next", "static");
        var targetStatic = Path.Combine(_appRoot, ".next", "standalone", ".next", "static");

        if (!Directory.Exists(sourceStatic))
        {
            Log("Pasta de assets static nao encontrada: " + sourceStatic);
            return;
        }

        try
        {
            CopyDirectory(sourceStatic, targetStatic);
            Log("Assets static sincronizados para: " + targetStatic);
        }
        catch (Exception ex)
        {
            Log("Falha ao sincronizar assets static: " + ex.Message);
            throw;
        }
    }

    private void CopyDirectory(string sourceDir, string targetDir)
    {
        Directory.CreateDirectory(targetDir);

        foreach (var directory in Directory.GetDirectories(sourceDir, "*", SearchOption.AllDirectories))
        {
            var relativeDirectory = directory.Substring(sourceDir.Length).TrimStart(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar);
            var destinationDirectory = Path.Combine(targetDir, relativeDirectory);
            Directory.CreateDirectory(destinationDirectory);
        }

        foreach (var file in Directory.GetFiles(sourceDir, "*", SearchOption.AllDirectories))
        {
            var relativeFile = file.Substring(sourceDir.Length).TrimStart(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar);
            var destinationFile = Path.Combine(targetDir, relativeFile);
            var destinationDirectory = Path.GetDirectoryName(destinationFile);
            if (!Directory.Exists(destinationDirectory))
            {
                Directory.CreateDirectory(destinationDirectory);
            }
            File.Copy(file, destinationFile, true);
        }
    }

    private void FreePortIfOccupied(string port)
    {
        try
        {
            var finder = new ProcessStartInfo
            {
                FileName = "cmd.exe",
                Arguments = "/c netstat -ano -p tcp | findstr :" + port,
                UseShellExecute = false,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                CreateNoWindow = true
            };

            using (var proc = Process.Start(finder))
            {
                if (proc == null)
                {
                    return;
                }

                var output = proc.StandardOutput.ReadToEnd();
                proc.WaitForExit(5000);

                if (string.IsNullOrWhiteSpace(output))
                {
                    return;
                }

                var lines = output.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
                foreach (var line in lines)
                {
                    if (!line.Contains("LISTENING"))
                    {
                        continue;
                    }

                    var parts = line.Trim().Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
                    if (parts.Length == 0)
                    {
                        continue;
                    }

                    var pidText = parts[parts.Length - 1];
                    int pid;
                    if (!int.TryParse(pidText, out pid))
                    {
                        continue;
                    }

                    if (pid <= 0)
                    {
                        continue;
                    }

                    if (_serverProcess != null && pid == _serverProcess.Id)
                    {
                        continue;
                    }

                    Log("Porta " + port + " ocupada pelo PID " + pid + ". Encerrando processo antigo.");
                    try
                    {
                        var killer = Process.Start(new ProcessStartInfo
                        {
                            FileName = "taskkill.exe",
                            Arguments = "/PID " + pid + " /T /F",
                            UseShellExecute = false,
                            CreateNoWindow = true
                        });
                        if (killer != null)
                        {
                            killer.WaitForExit(10000);
                        }
                    }
                    catch (Exception ex)
                    {
                        Log("Falha ao encerrar PID antigo " + pid + ": " + ex.Message);
                    }
                }
            }
        }
        catch (Exception ex)
        {
            Log("Falha ao verificar porta " + port + ": " + ex.Message);
        }
    }

    private void WatchServer()
    {
        try
        {
            if (_serverProcess != null)
            {
                _serverProcess.WaitForExit();
            }
        }
        catch
        {
            // Ignora falhas de espera.
        }

        if (_serverProcess != null)
        {
            Log("Servidor encerrou com exit code: " + _serverProcess.ExitCode);
        }

        if (!_stopping)
        {
            try { Stop(); } catch { }
        }
    }

    private void StopServer()
    {
        try
        {
            if (_serverProcess != null && !_serverProcess.HasExited)
            {
                try
                {
                    var pid = _serverProcess.Id;
                    var killer = Process.Start(new ProcessStartInfo
                    {
                        FileName = "taskkill.exe",
                        Arguments = "/PID " + pid + " /T /F",
                        UseShellExecute = false,
                        CreateNoWindow = true
                    });
                    if (killer != null)
                    {
                        killer.WaitForExit(10000);
                    }
                }
                catch
                {
                    try { _serverProcess.Kill(); } catch { }
                }

                try { _serverProcess.WaitForExit(5000); } catch { }
            }
        }
        finally
        {
            if (_serverProcess != null)
            {
                _serverProcess.Dispose();
            }
            _serverProcess = null;
        }
    }

    private void Log(string message)
    {
        try
        {
            var directory = Path.GetDirectoryName(_logPath);
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            File.AppendAllText(_logPath, "[" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "] " + message + Environment.NewLine);
        }
        catch
        {
            // Ignora falha secundÃ¡ria de log.
        }
    }

    private static string Quote(string value)
    {
        return "\"" + value.Replace("\"", "\\\"") + "\"";
    }
}
