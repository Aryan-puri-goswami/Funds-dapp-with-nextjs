// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Funder {
    uint256 public numOfFunders;

    mapping(uint256 => address) private funders;

    receive() external payable {}

    function transfer() external payable {
        funders[numOfFunders] = msg.sender;
    }

    function withdraw(uint256 withdrawAmount) external {
        require(
            withdrawAmount <= 2000000000000000000,
            "Cannot withdraw more than 2 ether"
        );
        payable(msg.sender).transfer(withdrawAmount);
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
