/**
 * Created by isaacjiang on 2017-07-17.
 */
import {Component,Input} from '@angular/core';
import {Events} from 'ionic-angular';
import 'rxjs';
import {HttpClient} from "@angular/common/http";
import {Api} from "../../services/api.service";


@Component({
    selector: 'edp-statistics',
    templateUrl: 'statistics.html'

})
export class StatisticsComponent {


    public formTitle = [];
    public formData = [];
    public menuId:any;

    public marketPerformance_value:any;
    public managementPerformance_value:any;
    public financialPerformance_value:any;
    public total_great_value:any;
    public great_value:any;


    constructor(public api:Api,
                public events: Events) {
       this.eventsHandles(this)
    }

    eventsHandles(root) {
        // root.events.unsubscribe('policyList')
        // root.events.subscribe('policyList', (originalData) => {
        //     console.log(originalData)
        //    root.fillingData(originalData)
        //
        // })
    }

  private formatNum(num){
    var n = num.toString(), p = n.indexOf('.');
    return n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, function($0, i){
      return p<0 || i<p ? ($0+',') : $0;
    });
  }

    initialiazation(current_user,menuID,user_info) {
      console.log(current_user,menuID,user_info)
      let root = this
      root.menuId = menuID;
      let url = "/api/general/querydashboarddata"+"?username="+current_user.username
      this.api.get(url).subscribe((res)=>{
        //console.log(res)
        var marketPerformance = res['marketPerformance']
        var managementPerformance = res['managementPerformance']
        var financialPerformance = res['financialPerformance']
       // console.log(financialPerformance)

        var niches = ['B2B', 'B2C', 'Education', 'Government', 'Entertainment']
        var periods = ['Previous', 'Current']
        var accountDescID = ['AB010', 'AB011', 'AB012', 'AB013', 'AB014', 'AB015']
        var accountDesc = ['Leadership', 'Marketing & Sales', 'Digital Marketing', 'Offering Suppport', 'Product development', 'Logistics & IT']
        var financialItem = ['Return on Sales', 'Return on Assets', 'Net Operating Cash Generated']

        root.marketPerformance_value = {}
        niches.forEach(function (n, i) {
          var value = {}
          periods.forEach(function (p) {
            if (marketPerformance != undefined && marketPerformance.length > 0) {
              var mp = marketPerformance.filter(function (m) {
                return m.niche == n && m.period == p
              })
              value[p] = mp.length > 0 ? (mp[0].shareRate * 100).toFixed(0) + '%' : 0
              value['rank' + p] = mp.length > 0 ? '#' + mp[0].ranking : '#'

            }


          })

          root.marketPerformance_value[n] = {"niche": n, "values": value}
        })

        //
        // $scope.query = {order: 'niche', page: 1};
        // $scope.limit_marketPerformance_value = {limit: $scope.marketPerformance_value.length};
//console.log($scope.marketPerformance_value)


        //console.log(managementValue)
        root.managementPerformance_value = {}
        accountDescID.forEach(function (acc, i) {

          var value = {}
          periods.forEach(function (p) {
            if (managementPerformance != undefined && managementPerformance.length > 0) {
              var mp = managementPerformance.filter(function (m) {
                return m.accountDescID == acc && m.period == p
              })

              value['competenceIndex' + p] = mp.length > 0 ? (mp[0].competenceIndex * 100).toFixed(0) : 100
              value['competenceIndexRank' + p] = mp.length > 0 ? "#" + mp[0].competenceIndexRank : '#'
              value['stressIndex' + p] = mp.length > 0 ? (mp[0].stressIndex * 100).toFixed(0) : 100
              value['stressIndexRank' + p] = mp.length > 0 ? "#" + mp[0].stressIndexRank : '#'
              value['adaptabilityIndex' + p] = mp.length > 0 ? (mp[0].adaptabilityIndex * 100).toFixed(0) : 100
              value['adaptabilityIndexRank' + p] = mp.length > 0 ? "#" + mp[0].adaptabilityIndexRank : '#'
            }
          })

          root.managementPerformance_value[acc] = {"function": accountDesc[i], "values": value}
        })
        // $scope.query_mp = {order: 'Item', page: 1};
        // $scope.limit_managementPerformance_value = {limit: $scope.managementPerformance_value.length};


        // console.log(financialPerformance)
        root.financialPerformance_value = {}
        financialItem.forEach(function (fi, i) {

          var value = {}
          var value_return_on_sales = {}
          var value_return_on_assest = {}
          periods.forEach(function (p, j) {
            if (financialPerformance != undefined && financialPerformance.length > 0) {
              financialPerformance.forEach(function (m) {
                if (m.values) {
                  if (i == 0 && m.period == p) {
                    value_return_on_sales[p] = (m.values.ROS * 100).toFixed(0) + '%'
                    value_return_on_sales['rank' + p] = "#" + m.values.ROSrank
                  }
                  if (i == 1 && m.period == p) {
                    value_return_on_assest[p] = (m.values.ROA * 100).toFixed(0) + '%'
                    value_return_on_assest['rank' + p] = "#" + m.values.ROArank
                  }
                  if (i == 2 && m.period == p) {

                    value[p] = root.formatNum(m.values.NOCG.toFixed(0))
                    value['rank' + p] = "#" + m.values.NOCGrank
                  }
                }

              })
            }
          })
          if (i == 0) {
            root.financialPerformance_value[fi] = {
              "financialItem": fi,
              "values": value_return_on_sales
            }
          }
          else if (i == 1) {
            root.financialPerformance_value[fi] = {
              "financialItem": fi,
              "values": value_return_on_assest
            }
          }
          else {
            root.financialPerformance_value[fi] = {"financialItem": fi, "values": value}
          }


          //$scope.financialPerformance_value[acc] = {"function":accountDesc[i],"values":value}
        })
        // //console.log($scope.financialPerformance_value)
        // $scope.query_mp = {order: 'Item', page: 1};
        // $scope.limit_financialPerformance_value = {limit: $scope.financialPerformance_value.length};
        // console.log('222', $scope.financialPerformance_value)

        //console.log('market', res)
        var marketValue = res['marketValue']
        var managementValue = res['managementValue']
        var financialValue = res['financialValue']


        //calculate great value

        //console.log("value", marketValue, managementValue, financialValue)
        var total_great_value = {}
        Object.keys(marketValue).forEach(function (teamName) {
          total_great_value[teamName] = {}
          Object.keys(marketValue[teamName]).forEach(function (period) {
            //console.log(period)
            if (period != 'teamName'){
              if(parseInt(period) > 1) {
              //console.log(financialValue[teamName][period - 1])
              if (financialValue[teamName][parseInt(period) - 1]) {
                if (financialValue[teamName][parseInt(period) - 1].NOCG <= 0) {
                  financialValue[teamName][parseInt(period) - 1].NOCG = 1
                }
              }
              else {
                financialValue[teamName][parseInt(period) - 1] = {}
                financialValue[teamName][parseInt(period) - 1].NOCG = 1
                financialValue[teamName][parseInt(period) - 1].EBITDA = 1
              }

              total_great_value[teamName][period] = marketValue[teamName][period] * 0.3 * managementValue[teamName][period] * 0.3 * financialValue[teamName][parseInt(period) - 1].NOCG * 0.4
            }
          }
          })


        })
        //console.log(total_great_value)
        var max_total_great_value = {}
        //var currentPeriod = $rootScope.userAtCompany.currentPeriod
        Object.keys(total_great_value).forEach(function (teamName) {
          Object.keys(total_great_value[teamName]).forEach(function (currentPeriod) {
            // console.log(total_great_value[teamName][currentPeriod])
            if (Object.keys(max_total_great_value).indexOf(currentPeriod) < 0) {
              max_total_great_value[currentPeriod] = 0
            }
            if (total_great_value[teamName][currentPeriod] > max_total_great_value[currentPeriod]) {
              max_total_great_value[currentPeriod] = total_great_value[teamName][currentPeriod]
            }
          })
        })
        // console.log(max_total_great_value)
        root.total_great_value = []
        Object.keys(total_great_value).forEach(function (teamName) {

          var companyValues = [], sharePrices = []

          Object.keys(total_great_value[teamName]).forEach(function (currentPeriod) {
            var value = total_great_value[teamName][currentPeriod]
            total_great_value[teamName][currentPeriod] = {}
            total_great_value[teamName][currentPeriod].value = value
            total_great_value[teamName][currentPeriod].percentage = value / max_total_great_value[currentPeriod]
            var pe = 0

            if (user_info.companyInfo.companyName == 'LegacyCo' && parseInt(currentPeriod) <= 4) {
              pe = 20
            }
            else if (user_info.companyInfo.companyName == 'LegacyCo' && parseInt(currentPeriod) == 5) {
              pe = 5
            }
            else if (user_info.companyInfo.companyName == 'LegacyCo' && parseInt(currentPeriod) == 6) {
              pe = 50
            }
            else if (user_info.companyInfo.companyName == 'LegacyCo' && parseInt(currentPeriod) == 7) {
              pe = 70
            }
            else if (user_info.companyInfo.companyName == 'LegacyCo' && parseInt(currentPeriod) == 8) {
              pe = 80
            }
            else if (user_info.companyInfo.companyName == 'NewCo' && parseInt(currentPeriod) == 5) {
              pe = 50
            }
            else if (user_info.companyInfo.companyName == 'NewCo' && parseInt(currentPeriod) == 6) {
              pe = 70
            }
            else if (user_info.companyInfo.companyName == 'NewCo' && parseInt(currentPeriod) == 7) {
              pe = 80
            }
            else if (user_info.companyInfo.companyName == 'NewCo' && parseInt(currentPeriod) == 8) {
              pe = 40
            }
            else {
              pe = 0
            }
            total_great_value[teamName][currentPeriod].PE = pe
            total_great_value[teamName][currentPeriod].realPE = pe * total_great_value[teamName][parseInt(currentPeriod)].percentage
            total_great_value[teamName][currentPeriod].EBITDA = financialValue[teamName][parseInt(currentPeriod) - 1].EBITDA
            total_great_value[teamName][currentPeriod].companyValue = financialValue[teamName][parseInt(currentPeriod) - 1].EBITDA * total_great_value[teamName][currentPeriod].realPE / 100
            total_great_value[teamName][currentPeriod].sharePrice = total_great_value[teamName][parseInt(currentPeriod)].companyValue / 100000

            companyValues.push({
              x: currentPeriod,
              y: total_great_value[teamName][currentPeriod].companyValue / 1000000
            })
            sharePrices.push({
              x: currentPeriod,
              y: total_great_value[teamName][currentPeriod].sharePrice
            })
          })


          root.total_great_value.push({
            values: companyValues,      //values - represents the array of {x,y} data points
            key: teamName + ' companyValues', //key  - the name of the series.
            color: '#' + Math.random().toString(16).substr(-6) //color - optional: choose your own line color.
          })
          root.total_great_value.push({
            values: sharePrices,      //values - represents the array of {x,y} data points
            key: teamName + ' sharePrices', //key  - the name of the series.
            color: '#' + Math.random().toString(16).substr(-6) //color - optional: choose your own line color.
          })
        })
       // console.log(total_great_value)


        var great_value = total_great_value[user_info.teamInfo.teamName]


        root.great_value = []
        var previusCompanyValue = 0
        var previusSharePrice = 0
        if (user_info.companyInfo.companyName == "NewCo") {
          previusCompanyValue = great_value[user_info.companyInfo.currentPeriod - 1] && (user_info.companyInfo.currentPeriod - 1) > 3 ?
            great_value[user_info.companyInfo.currentPeriod - 1].companyValue.toFixed(0) : 0
          previusSharePrice = great_value[user_info.companyInfo.currentPeriod - 1] && (user_info.companyInfo.currentPeriod - 1) > 3 ?
            great_value[user_info.companyInfo.currentPeriod - 1].sharePrice.toFixed(0) : 0
        }
        else {
          previusCompanyValue =great_value[user_info.companyInfo.currentPeriod - 1] && (user_info.companyInfo.currentPeriod - 1) > 1 ?
            great_value[user_info.companyInfo.currentPeriod - 1].companyValue.toFixed(0) : 0
          previusSharePrice = great_value[user_info.companyInfo.currentPeriod - 1] && (user_info.companyInfo.currentPeriod - 1) > 1 ?
            great_value[user_info.companyInfo.currentPeriod - 1].sharePrice.toFixed(0) : 0
        }


        root.great_value.push({
          "key": "Company Value",
          "Previus": root.formatNum(previusCompanyValue),
          "Current": root.formatNum(great_value[user_info.companyInfo.currentPeriod].companyValue.toFixed(0))
        })
        root.great_value.push( {
          "key": "Share Price",
          "Previus": root.formatNum(previusSharePrice),
          "Current": root.formatNum(great_value[user_info.companyInfo.currentPeriod].sharePrice.toFixed(0))
        })


        switch (menuID){
          default:
            root.formTitle=["","Previous","Current"];
            //console.log("---",root.great_value)

            for (let index in root.great_value){
             root.formData[index] = [root.great_value[index].key,root.great_value[index].Previus,root.great_value[index].Current]
            }
            break;
          case "dashboard2":
            root.formTitle=["","Previous","Previous Rank #",	"Current",	"Current Rank #"];

            for (let index in root.marketPerformance_value){
              //console.log("---",root.marketPerformance_value[index])
              root.formData.push([root.marketPerformance_value[index].niche,
                root.marketPerformance_value[index].values.Previous,root.marketPerformance_value[index].values.rankPrevious,
                root.marketPerformance_value[index].values.Current,root.marketPerformance_value[index].values.rankCurrent
              ])
            }

            break;
          case "dashboard3":
            root.formTitle=["","Previous","Previous Rank #",	"Current",	"Current Rank #"];

            for (let index in root.financialPerformance_value){

              root.formData.push([root.financialPerformance_value[index].financialItem,
                root.financialPerformance_value[index].values.Previous,root.financialPerformance_value[index].values.rankPrevious,
                root.financialPerformance_value[index].values.Current,root.financialPerformance_value[index].values.rankCurrent
              ])
            }

            break;
          case "dashboard4":
            root.formTitle=["Function","P: Competence","P:Rank",	"C:Competence",	"C: Rank","P: Stress","P:Rank",
            "C:Stress","C: Rank","P: Adaptability","P:Rank","C:Adaptability","C: Rank"];


            for (let index in root.managementPerformance_value){

              root.formData.push([root.managementPerformance_value[index].function,
                root.managementPerformance_value[index].values.competenceIndexPrevious,
                root.managementPerformance_value[index].values.competenceIndexRankPrevious,
                root.managementPerformance_value[index].values.competenceIndexCurrent,
                root.managementPerformance_value[index].values.competenceIndexRankCurrent,

                root.managementPerformance_value[index].values.stressIndexPrevious,
                root.managementPerformance_value[index].values.stressIndexRankPrevious,
                root.managementPerformance_value[index].values.stressIndexCurrent,
                root.managementPerformance_value[index].values.stressIndexRankCurrent,

                root.managementPerformance_value[index].values.adaptabilityIndexPrevious,
                root.managementPerformance_value[index].values.adaptabilityIndexRankPrevious,
                root.managementPerformance_value[index].values.adaptabilityIndexCurrent,
                root.managementPerformance_value[index].values.adaptabilityIndexRankCurrent
              ])
            }

            break;

        }
         console.log(root.formData)
        //
        // $scope.query = {order: 'niche', page: 1};
        // $scope.limit_great_value = {limit: $scope.great_value.length};
      })



    }

    fillingData(originalData) {

        // let titleList = [];

    }
    selectLine(event){

    }

    selectCell(row,col){
      console.log(row,col)
    }






}
