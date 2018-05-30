pragma solidity ^0.4.23;

contract PublicArticle {
    string private articleName;
    string private articleText;

    uint public expires;

    address public owner = msg.sender;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier limitedTime() {
        require(now <= expires);
        _;
    }

    function setArticleName(string _articleName) public onlyOwner {
        articleName = _articleName;
    }

    function setArticleText(string _articleText) public onlyOwner {
        articleText = _articleText;
    }

    function setDuration(uint _duration) public onlyOwner {
        expires = now + _duration;
    }

    function getArticleName() view public limitedTime returns (string) {
        return articleName;
    }

    function getArticleText() view public limitedTime returns (string) {
        return articleText;
    }
}