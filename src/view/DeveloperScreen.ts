import promptSync from "prompt-sync";
import DeveloperController from "../controllers/DeveloperController";
import Router from "../Router";
import Database from "../database/Database";
import Validator from "../models/Validator";
import VacancyController from "../controllers/VacancyController";

export default class DeveloperScreen {
  private prompt = promptSync();
  private router: Router;
  private db = Database.getInstance();
  private developerController: DeveloperController;
  private vacancyController: VacancyController;
  constructor(router: Router) {
    this.router = router;

    const validator = new Validator();
    this.developerController = new DeveloperController(this.db, validator); // Passando o validator
    this.vacancyController = new VacancyController(this.db)
  }

  // Método para registrar um novo desenvolvedor
  public registerDeveloper(): void {
    console.log("-------------------------------------------------------------------------------");
    console.log("Cadastro de Desenvolvedor");
    console.log("-------------------------------------------------------------------------------");

    let developer = this.developerController.getNewDeveloper();

    // Obter os dados do desenvolvedor
    developer.setName(this.prompt("Informe seu Nome: "));
    developer.setEmail(this.prompt("Informe o e-mail: "));
    developer.setPassword(this.prompt("Informe a senha: "));

    // Registrar as habilidades
    const skills = this.developerController.registerSkills();
    developer.setSkills(skills); // Atribuir as habilidades ao desenvolvedor

    try {
      // Validar e registrar o desenvolvedor
      this.developerController.validateAndRegisterDeveloper(developer);
    } catch (error: any) {
      error(1);
    } finally {
      this.router.navigateToPrimaryScreen();
    }
  }


  public dashboardDeveloper(userId: number): void {
    console.log("-------------------------------------------------------------------------------");
    console.log(`Bem-vindo(a)`);
    console.log("");
    console.log("1 - Vagas");
    console.log("2 - Habilidades");
    console.log("3 - Sair");
    console.log("-------------------------------------------------------------------------------");

    const choice = this.prompt("Digite a opção desejada: ").trim();

    switch (choice) {
      case "1":
        // Acessar Vagas Developer
        this.router.navigateToVacancyScreenDeveloper(userId);
        break;
      case "2":
        // Gerenciar as habilidades do usuário
        this.router.navigateToSkillsScreen(userId);
        break;
      case "3":
        this.router.navigateToPrimaryScreen(); // Voltar para a tela principal
        break;
      default:
        console.log("Opção inválida. Por favor, tente novamente.");
        this.dashboardDeveloper(userId); // Reexibir o menu
    }
  }

  public vacancyDeveloper(userId: number): void {
    console.log("-------------------------------------------------------------------------------");
    console.log(`Opções de Vagas - Developer (Inserir Nome):`);
    console.log("");
    console.log("1 - Buscar Vagas");
    console.log("2 - Minhas Candidaturas");
    console.log("3 - Desistir de Candidatura");
    console.log("4 - Voltar ao Dashboard");
    console.log("-------------------------------------------------------------------------------");

    const choice = this.prompt("Digite a opção desejada: ").trim();

    switch (choice) {
      case "1":
        this.searchVacancies(userId);
        break;
      case "2":
        this.listMyCandidatures();
        break;
      case "3":
        this.withdrawApplication(userId);
        break;
      case "4":
        this.dashboardDeveloper(userId); // Voltar para Dashboard
        break;
      default:
        console.log("Opção inválida. Por favor, tente novamente.");
        this.vacancyDeveloper(userId); // Reexibir o menu
    }
  }

  // Buscar vagas e inscrever-se
  private searchVacancies(userId: number): void {
    console.log("-------------------------------------------------------------------------------");
    const vacancies = this.vacancyController.listVacancies();
    vacancies.forEach((vacancy, index) => {
      console.log(`${index + 1}. ${vacancy.getTitle()} - ${vacancy.getDescription()}`);
    });

    const vacancyChoice = this.prompt("Digite o número da vaga que deseja se inscrever: ").trim();
    if (vacancyChoice.trim().toLowerCase() === "B") this.dashboardDeveloper(userId);

    const selectedVacancy = vacancies[parseInt(vacancyChoice) - 1];
    if (!selectedVacancy) {
      console.log("Vaga inválida.");
      return;
    }

    const developerId = 1; // Substitua pelo ID do desenvolvedor atual
    this.vacancyController.registerDeveloperToVacancy(developerId, selectedVacancy.getTitle());
  }

  // Listar candidaturas do desenvolvedor
  private listMyCandidatures(): void {
    console.log("-------------------------------------------------------------------------------");
    const developerId = 1; // Substitua pelo ID do desenvolvedor atual
    this.db.getVacancies().forEach(vacancy => {
      if (vacancy.getCandidates().includes(developerId)) {
        console.log(`- ${vacancy.getTitle()}`);
      }
    });
    console.log("-------------------------------------------------------------------------------");
  }

  // Desistir de uma candidatura
  private withdrawApplication(userId: number): void {
    console.log("-------------------------------------------------------------------------------");
    const developerId = 1; // Substitua pelo ID do desenvolvedor atual
    const vacancies = this.db.getVacancies().filter(vacancy => vacancy.getCandidates().includes(developerId));

    vacancies.forEach((vacancy, index) => {
      console.log(`${index + 1}. ${vacancy.getTitle()}`);
    });

    const choice = this.prompt("Digite o número da vaga que deseja desistir: ").trim();
    if (choice.trim().toLowerCase() === "B") this.dashboardDeveloper(userId);
    const selectedVacancy = vacancies[parseInt(choice) - 1];
    if (!selectedVacancy) {
      console.log("Vaga inválida.");
      return;
    }

    this.vacancyController.removeDeveloperFromVacancy(developerId, selectedVacancy.getTitle());
  }


  public skillsDeveloper(userId: number): void {
    console.log("-------------------------------------------------------------------------------");
    console.log(`Opções de Habilidades - Developer (Inserir Nome):`);
    console.log("");
    console.log("1 - Listar Habilidades");
    console.log("2 - Adicionar");
    console.log("3 - Remover");
    console.log("4 - Voltar ao Menu");
    console.log("-------------------------------------------------------------------------------");

    const choice = this.prompt("Digite a opção desejada: ").trim();

    switch (choice) {
      case "1":
        // Listar Habilidades
        this.developerController.listSkills(userId);
        break;
      case "2":
        // Adicionar Habilidades
        this.developerController.registerSkills();
        break;
      case "3":
        // Remover Habilidades
        const skillRemoveIdStr = this.prompt("Digite o ID da Habilidade que será removida: ").trim();
        const skillRemoveId = parseInt(skillRemoveIdStr, 10); // Garantir que o ID seja um número

        // Verifica se o ID é válido
        if (isNaN(skillRemoveId)) {
          console.log("Por favor, insira um ID válido.");
          this.skillsDeveloper(userId); // Reexibir o menu
        } else {
          this.developerController.removeSkills(skillRemoveId)
        }
        break;
      case "4":
        this.dashboardDeveloper(userId);
        break;
      default:
        console.log("Opção inválida. Por favor, tente novamente.");
        this.skillsDeveloper(userId); // Reexibir o menu
    }
  }
}
