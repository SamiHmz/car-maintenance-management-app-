const { sequelize } = require("../models");

const DashbordController = {};

const mapMonth = (tab) => {
  const month_data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  tab.forEach((item) => {
    month_data[item.month - 1] = parseInt(item.cout);
  });
  return month_data;
};
const addTwoTable = (tab1, tab2) => {
  const tab = [];
  for (let i = 0; i < tab1.length; i++) {
    tab[i] = tab1[i] + tab2[i];
  }
  return tab;
};

// const mapStatus = (tab) => {
//   const status = {};
//   tab.forEach((item) => {
//     status[item.status] = parseInt(item.nb_vehicule);
//   });
//   return status;
// };

DashbordController.getDashboardDate = async (req, res) => {
  const data = {};

  try {
    //nb vehicule

    const nb_vehicule = await sequelize.query(`select count(v.matricule) from vehicule  v
        where v.user_id= ${req.user.id} `);
    data.nb_vehicule = parseInt(nb_vehicule[0][0].count);

    //cout carburant par mois

    const carburant = await sequelize.query(`select date_part('month',c.date) as month ,sum(c.cout) as cout from carburant c 
    join vehicule  v 
    on v.matricule = c.vehicule_id 
    where  date_part('year', (SELECT current_timestamp)) =  date_part('year', c.date) and v.user_id = ${req.user.id}
    group by date_part('month',c.date)`);
    data.carburant = mapMonth(carburant[0]);

    //cout maintenance par mois

    const maintenance = await sequelize.query(`select date_part('month',vm.date_planification) as month ,sum(m.cout) as cout from vehiculemaintenance vm 
    join vehicule v 
    on v.matricule = vm.vehicule_id 
    join maintenance m 
    on m.id = vm.maintenance_id 
    where  date_part('year', (SELECT current_timestamp)) =  date_part('year', vm.date_planification) and v.user_id = ${req.user.id}
    group by date_part('month',vm.date_planification) `);
    data.maintenance = mapMonth(maintenance[0]);

    // status vehicules
    const status = await sequelize.query(
      `select status,count(matricule) as nb_vehicule from vehicule where vehicule.user_id = 
      ${req.user.id}
       group by status `
    );
    data.status_vehicules = status[0].map((item) => parseInt(item.nb_vehicule));

    // cout total par mois
    data.cout_total = addTwoTable(data.maintenance, data.carburant);
    volume = await sequelize.query(`select sum(volume) from carburant c 
    join vehicule v on v.matricule = c.vehicule_id 
    where v.user_id = ${req.user.id}
    `);
    data.volume_carburant = parseInt(volume[0][0].sum);

    // cout total
    data.total = data.cout_total.reduce(
      (accumulator, currentValue) => accumulator + currentValue
    );

    // suivi par model
    const suivi_model = await sequelize.query(`select marque.nom as marque ,np.nom as model,np.nb_problem,cc.cout_carburant,cc.volume_caburant,cm.cout_maintenance,nm.nb_mission
    from (select m.nom ,m.marque_id,count(DISTINCT p.id) as nb_problem
    from  vehicule v 
    join model m  
        on m.id = v.model_id 
    join marque  mr 
        on mr.id = m.marque_id
    left join problem p 
        on p.vehicule_id = v.matricule 
        where v.user_id = ${req.user.id}

    group by m.nom,m.marque_id ) as np
    
    join ( 
        select m.nom ,sum(DISTINCT c.cout) as cout_carburant ,sum(c.volume) as volume_caburant 
    from  vehicule v 
    join model m  
        on m.id = v.model_id 
    join marque  mr 
        on mr.id = m.marque_id
   left join carburant c 
       on c.vehicule_id = v.matricule    
       where v.user_id = ${req.user.id}

        group by m.nom    
    ) as cc 
    on np.nom = cc.nom

     join (

    select m.nom ,sum(ma.cout) as cout_maintenance 
    from  vehicule v 
    join model m  
        on m.id = v.model_id 
    join marque  mr 
        on mr.id = m.marque_id
    left join vehiculemaintenance vm
       on vm.vehicule_id = v.matricule 
    left join maintenance ma
       on ma.id = vm.maintenance_id   
       where v.user_id = ${req.user.id}

      group by m.nom    

    )  as  cm
       on np.nom = cm.nom
     join (

    select m.nom ,count(mi.id) as nb_mission
    from  vehicule v 
    join model m  
        on m.id = v.model_id 
    join marque  mr 
        on mr.id = m.marque_id
   left  join mission mi 
       on mi.vehicule_id = v.matricule   
  where v.user_id = ${req.user.id}

    group by m.nom 

    )  as  nm
       on np.nom = nm.nom

     join marque on 
     marque.id = np.marque_id  
  `);

    data.suivi_model = suivi_model[0];
    res.send(data);
  } catch (error) {
    console.log(error);
  }
};

exports.DashbordController = DashbordController;
exports.mapMonth = mapMonth;
exports.addTwoTable = addTwoTable;
