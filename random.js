//Copyright 2016 Trevor Gast: codeandcompose.com
		//Random Distribution Object v. 1.0
		//GNU General Public License
		//This program is free software: you can redistribute it and/or modify
    	//it under the terms of the GNU General Public License as published by
		//the Free Software Foundation, either version 3 of the License, or
		//(at your option) any later version.
		//
		//This program is distributed in the hope that it will be useful,
		//but WITHOUT ANY WARRANTY; without even the implied warranty of
		//MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
		//GNU General Public License for more details.

		//You should have received a copy of the GNU General Public License
		//along with this program.  If not, see <http://www.gnu.org/licenses/>.

// https://codeandcompose.blogspot.com/2016/05/a-random-post.html

var RANDOM = { //returns random between 0 and 1, normal distribution centered on 0.5
	"norm": function(n) {
		if (!(n > 2 && n <= 5)) n = 2;
		var nrand = 0;
		n = Math.floor(n);
		for (var i = 1;i<=n*2;i++){
			nrand += Math.random();
		}
		return nrand/(2*n);
	},
	"inorm": function(n) { //returns random between 0 and 1
		if (!(n > 2 && n <= 5)) n = 2;
		var nrand = 0;
		n = Math.floor(n);
		for (var i = 1;i<=n*2;i++){
			nrand += Math.random();
		}
		return ((1 - Math.abs((nrand-n) / n))*(Math.abs(nrand-n)/(nrand-n)) + 1)/2;
	},
	"exp": function(n) { //returns greater than 0
		if (!(n > 2 && n <= 5)) n = 2;
		var nrand = Math.random();
		for (var i = 2;i<=n;i++){
			nrand *= Math.random();
		}
		return 2*nrand;
	},
	"invexp": function(n) { //returns less than 0
		return -RANDOM.exp(n);
	},
	"gamma3": function(alpha) { //Kundu and Gupta algorithm 3 http://home.iitk.ac.in/~kundu/paper120.pdf
		if (!alpha || Math.abs(alpha) > 1) alpha = 1; //alpha between 0 and 1
		var d = 1.0334 - (0.0766*Math.exp(2.2942*alpha));
		var a = Math.pow(2,alpha)*Math.pow(1-Math.exp(-d/2),alpha);
		var b = alpha*Math.pow(d,alpha-1)*Math.exp(-d);
		var c = a + b;
		var U = Math.random();
		var X = (U <= a/(a+b)) ? -2*Math.log(1-(Math.pow(c*U,1/alpha)/2)) : -Math.log(c*(1-U)/(alpha*Math.pow(d,alpha-1)));
		var V = Math.random();
		if (X <= d) {
			var mess = (Math.pow(X,alpha-1)*Math.exp(-X/2))/(Math.pow(2,alpha-1)*Math.pow(1-Math.exp(-X/2),alpha-1));
			if (V <= mess) return X;
			else return this.gamma3(alpha);
		} else { //X > d
			if (V <= Math.pow(d/X,1-alpha)) return X;
			else return this.gamma3(alpha);
		}
		//output is > 0 and possibly > 1
	},
	"gamma": function(alpha,beta) { //Martino and Luengo http://arxiv.org/pdf/1304.3800.pdf luca@tsc.uc3m.es luengod@ieee.org
		if (!alpha || alpha <= 0) alpha = 1; //alpha >= 1 if negative or 0
		if (alpha > 0 && alpha < 1) return this.gamma3(alpha); // use different algorithm
		if (!beta || beta <= 0) beta = 1; //beta > 0
		var alphap = Math.floor(alpha);
		var X = Math.random();
		for (var i=2;i<=alphap;i++){
			X *= Math.random();
		}	
		var betap = (alpha < 2) ? beta/alpha : beta*(alphap-1)/(alpha-1);
		X = -Math.log(X)/betap;
		var Kp = (alpha < 2) ? Math.exp(1-alpha)*Math.pow(alpha/beta,alpha-1) : Math.exp(alphap-alpha)*Math.pow((alpha-1)/beta,alpha-alphap);
		//then accept with prob p(X)/pi(X)
		if (alphap >= 2) {
			if (Kp*Math.pow(X,alphap-1)*Math.exp(-betap*X) >= Math.pow(X,alpha-1)*Math.exp(-beta*X)) return X/alpha;
			else return this.gamma(alpha,beta);
		}
		else if (alphap < 2) {
			if (Kp*Math.exp(-betap*X) >= Math.pow(X,alpha-1)*Math.exp(-beta*X)) return X/alpha;
			else return this.gamma(alpha,beta);
		}
	},
	"igamma": function(alpha,beta) { // returns less than 0
		return -RANDOM.gamma(alpha,beta);
	},
	"chi2": function(k) { // returns greater than 0
		var nrand = RANDOM.norm(2);
    	nrand = nrand*nrand;
		if (!k || k <= 1) return nrand;
		for (var i=2;i<=k;i++){
			var krand = RANDOM.norm(2);
			krand = krand*krand;
			nrand += krand;
		}
    	return nrand;
	},
	"coinFlip": function(weight){
		if (!weight || weight < 1) weight = 2;
		if (Math.random() > 1/weight) return 1;
		else return 0;
	}
	//for consistent results
	//RANDOM.norm(2)
	//RANDOM.inorm(2)
	//RANDOM.exp(2)
	//RANDOM.gamma(2,2)
	//RANDOM.chi2(7)
};